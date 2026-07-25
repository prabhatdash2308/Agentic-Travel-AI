from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_logger
from app.models.workflow import WorkflowModel
from app.schemas.workflow import WorkflowResponse, WorkflowStatus

logger = get_logger(__name__)


class WorkflowRepository:
    """
    Data-access object for the `workflows` table.

    All methods accept an AsyncSession injected from get_db().
    No session lifecycle management happens here — that belongs to the
    caller (either the FastAPI dependency or PlannerService).
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ── Write ─────────────────────────────────────────────────────────────────

    async def create(
        self,
        *,
        workflow_id: str,
        user_id: str | None,
        query: str,
        status: WorkflowStatus,
        estimated_steps: list[str],
    ) -> WorkflowModel:
        record = WorkflowModel(
            workflow_id=workflow_id,
            user_id=user_id,
            query=query,
            status=status.value if hasattr(status, "value") else status,
            estimated_steps=WorkflowModel.encode_steps(estimated_steps),
            completed_steps="",
            final_plan=None,
            error_message=None,
        )
        self._session.add(record)
        await self._session.flush()  # assigns server_defaults without committing
        logger.debug("WorkflowRepo.create | id=%s", workflow_id)
        return record

    async def update_status(
        self,
        workflow_id: str,
        *,
        status: WorkflowStatus,
        completed_steps: list[str] | None = None,
        final_plan: str | None = None,
        error_message: str | None = None,
    ) -> None:
        values: dict = {
            "status": status.value if hasattr(status, "value") else status,
            "updated_at": datetime.now(tz=timezone.utc),
        }
        if completed_steps is not None:
            values["completed_steps"] = WorkflowModel.encode_steps(completed_steps)
        if final_plan is not None:
            values["final_plan"] = final_plan
        if error_message is not None:
            values["error_message"] = error_message

        stmt = (
            update(WorkflowModel)
            .where(WorkflowModel.workflow_id == workflow_id)
            .values(**values)
        )
        await self._session.execute(stmt)
        logger.debug("WorkflowRepo.update_status | id=%s status=%s", workflow_id, status)

    # ── Read ──────────────────────────────────────────────────────────────────

    async def get(self, workflow_id: str) -> WorkflowModel | None:
        result = await self._session.execute(
            select(WorkflowModel).where(WorkflowModel.workflow_id == workflow_id)
        )
        return result.scalar_one_or_none()

    # ── Converter ─────────────────────────────────────────────────────────────

    @staticmethod
    def to_response(record: WorkflowModel) -> WorkflowResponse:
        return WorkflowResponse(
            workflow_id=record.workflow_id,
            status=WorkflowStatus(record.status),
            message=_status_message(record),
            created_at=record.created_at,
            estimated_steps=WorkflowModel.decode_steps(record.estimated_steps),
            final_plan=record.final_plan,
            completed_steps=WorkflowModel.decode_steps(record.completed_steps),
        )


def _status_message(record: WorkflowModel) -> str:
    messages = {
        "pending":   f"Workflow '{record.workflow_id}' accepted and queued for planning.",
        "running":   f"Workflow '{record.workflow_id}' is currently being planned.",
        "completed": f"Workflow '{record.workflow_id}' completed successfully.",
        "failed":    f"Workflow '{record.workflow_id}' failed: {record.error_message or 'unknown error'}.",
    }
    return messages.get(record.status, f"Workflow '{record.workflow_id}' status: {record.status}.")
