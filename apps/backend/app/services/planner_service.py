from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.core import get_logger, NotFoundError, ValidationError
from app.schemas.workflow import (
    TravelPreferences,
    WorkflowRequest,
    WorkflowResponse,
    WorkflowStatus,
)

logger = get_logger(__name__)


class PlannerService:
    """
    Orchestrates travel planning workflows.

    Lifecycle:
        1. create_workflow()       — validate, assign UUID, return PENDING
        2. [TODO] _run_agent_pipeline() — execute LangGraph agent
        3. get_workflow_status()   — query DB/cache for current state
    """

    async def create_workflow(self, request: WorkflowRequest) -> WorkflowResponse:
        """
        Accept a planning request, generate a UUID4 workflow ID, and return
        an initial PENDING response.

        Raises:
            ValidationError: Business-rule validation failure.
        """
        self._validate_request(request)

        workflow_id = str(uuid.uuid4())
        created_at = datetime.now(tz=timezone.utc)

        logger.info(
            "Workflow accepted | id=%s user=%s query=%.80s",
            workflow_id,
            request.user_id,
            request.query,
        )

        estimated_steps = self._build_estimated_steps(request)

        # TODO: Persist workflow record to database
        # await db.workflow_repo.create({
        #     "id": workflow_id,
        #     "user_id": request.user_id,
        #     "query": request.query,
        #     "status": WorkflowStatus.PENDING,
        #     "created_at": created_at,
        # })

        # TODO: Enqueue async LangGraph agent task
        # await task_queue.enqueue("run_planner_agent", workflow_id=workflow_id)

        return WorkflowResponse(
            workflow_id=workflow_id,
            status=WorkflowStatus.PENDING,
            message=(
                f"Workflow '{workflow_id}' accepted and queued for planning. "
                "Poll /api/status/{workflow_id} for updates."
            ),
            created_at=created_at,
            estimated_steps=estimated_steps,
        )

    async def get_workflow_status(self, workflow_id: str) -> WorkflowResponse:
        """
        Retrieve the current state of a workflow by ID.

        Raises:
            ValidationError: If workflow_id is not a valid UUID4.
            NotFoundError:   If no workflow with this ID exists.
        """
        self._validate_workflow_id(workflow_id)

        logger.info("Status requested | id=%s", workflow_id)

        # TODO: Query database / Redis cache
        # record = await db.workflow_repo.get(workflow_id)
        # if record is None:
        #     raise NotFoundError(f"Workflow '{workflow_id}' not found.")
        # return WorkflowResponse(**record.to_dict())

        raise NotFoundError(
            f"Workflow '{workflow_id}' not found. "
            "Database persistence is not yet implemented.",
            details={"workflow_id": workflow_id},
        )

    # ── Private helpers ───────────────────────────────────────────────────────

    def _validate_request(self, request: WorkflowRequest) -> None:
        """Apply business rules beyond Pydantic field validation."""
        if not request.query.strip():
            raise ValidationError(
                "Travel query must not be empty.",
                details={"field": "query"},
            )

        if request.preferences is not None:
            prefs = request.preferences

            if prefs.duration_days is not None and prefs.duration_days < 1:
                raise ValidationError(
                    "Trip duration must be at least 1 day.",
                    details={"field": "preferences.duration_days"},
                )

            if prefs.destinations is not None and len(prefs.destinations) == 0:
                raise ValidationError(
                    "If 'destinations' is provided it must contain at least one entry.",
                    details={"field": "preferences.destinations"},
                )

    def _validate_workflow_id(self, workflow_id: str) -> None:
        """Ensure workflow_id is a valid UUID4 string."""
        try:
            parsed = uuid.UUID(workflow_id, version=4)
            if str(parsed) != workflow_id.lower():
                raise ValueError
        except ValueError:
            raise ValidationError(
                f"'{workflow_id}' is not a valid UUID4 workflow identifier.",
                details={"workflow_id": workflow_id},
            )

    def _build_estimated_steps(self, request: WorkflowRequest) -> list[str]:
        """
        Build an ordered list of planning steps based on the request.

        Currently static — shaped by preferences when provided.

        TODO: Replace with dynamic LLM step planning after LangGraph integration:
              steps = await planner_agent.plan_steps(request)
        """
        steps: list[str] = [
            "Parse and understand travel intent",
            "Identify key requirements and constraints",
            "Research destination highlights and attractions",
            "Draft a day-by-day itinerary",
        ]

        prefs: TravelPreferences | None = request.preferences

        if prefs is not None:
            if prefs.budget is not None:
                steps.append(f"Tailor recommendations for a '{prefs.budget.value}' budget")

            if prefs.travel_style:
                steps.append(
                    "Incorporate travel style preferences: "
                    + ", ".join(prefs.travel_style)
                )

            if prefs.origin is not None:
                steps.append(f"Research transport options from {prefs.origin}")

            if prefs.destinations and len(prefs.destinations) > 1:
                steps.append("Optimise multi-destination routing and logistics")

        steps.extend([
            "Estimate costs and budget breakdown",
            "Compile local tips, cultural notes, and packing advice",
            "Assemble and format the final travel plan",
        ])

        return steps

    # TODO: LangGraph agent pipeline (runs in background after create_workflow)
    # async def _run_agent_pipeline(self, workflow_id: str, request: WorkflowRequest) -> None:
    #     """
    #     1. Mark workflow status → RUNNING
    #     2. Invoke LangGraph graph with request as initial state
    #     3. Stream steps to Redis pub/sub
    #     4. On success: status → COMPLETED, persist result
    #     5. On error:   status → FAILED, log traceback
    #     """
    #     raise NotImplementedError


def get_planner_service() -> PlannerService:
    """
    FastAPI dependency provider for PlannerService.

    Usage:
        service: PlannerService = Depends(get_planner_service)

    TODO: Inject DB session and LLM client when ready:
        def get_planner_service(
            db: AsyncSession = Depends(get_db),
            llm: ChatGoogleGenerativeAI = Depends(get_llm),
        ) -> PlannerService:
            return PlannerService(db=db, llm=llm)
    """
    return PlannerService()
