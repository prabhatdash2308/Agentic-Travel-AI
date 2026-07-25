from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any

from app.core import get_logger
from app.schemas.workflow import WorkflowResponse, WorkflowStatus

logger = get_logger(__name__)


class WorkflowStore:
    """
    Thread-safe in-memory store for workflow records.

    Replaces DB persistence until the database layer is implemented.
    All records are lost on server restart — suitable for development only.

    Schema of each record:
        {
            "workflow_id":     str,
            "status":          WorkflowStatus,
            "message":         str,
            "created_at":      datetime,
            "estimated_steps": list[str],
            "final_plan":      str | None,
            "completed_steps": list[str],
            "error":           str | None,
        }
    """

    def __init__(self) -> None:
        self._store: dict[str, dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def create(self, record: dict[str, Any]) -> None:
        async with self._lock:
            self._store[record["workflow_id"]] = record
            logger.debug("WorkflowStore.create | id=%s", record["workflow_id"])

    async def get(self, workflow_id: str) -> dict[str, Any] | None:
        async with self._lock:
            return self._store.get(workflow_id)

    async def update(self, workflow_id: str, **fields: Any) -> None:
        async with self._lock:
            if workflow_id in self._store:
                self._store[workflow_id].update(fields)
                logger.debug(
                    "WorkflowStore.update | id=%s fields=%s",
                    workflow_id,
                    list(fields.keys()),
                )

    def to_response(self, record: dict[str, Any]) -> WorkflowResponse:
        return WorkflowResponse(
            workflow_id=record["workflow_id"],
            status=record["status"],
            message=record["message"],
            created_at=record["created_at"],
            estimated_steps=record.get("estimated_steps", []),
            final_plan=record.get("final_plan"),
            completed_steps=record.get("completed_steps", []),
        )


# Module-level singleton shared across the app lifetime
workflow_store = WorkflowStore()
