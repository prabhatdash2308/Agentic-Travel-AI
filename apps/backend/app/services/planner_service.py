"""
app/services/planner_service.py
--------------------------------
PlannerService — orchestration layer for travel planning workflows.

Architecture notes
------------------
- Stateless class; intended to be used as a FastAPI dependency via Depends().
- All LLM / LangGraph integration points are marked with TODO comments.
- UUID4 workflow IDs are generated here; persistence (DB/Redis) is stubbed.
- Logging is structured so log lines can be parsed by any aggregator (Datadog, GCP Logging, etc.).
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.core import get_logger, NotFoundError, ValidationError, WorkflowError
from app.schemas.workflow import (
    TravelPreferences,
    WorkflowRequest,
    WorkflowResponse,
    WorkflowStatus,
)

logger = get_logger(__name__)


class PlannerService:
    """
    Core service responsible for orchestrating AI travel planning workflows.

    Lifecycle of a workflow:
        1. create_workflow()  →  validates input, assigns UUID, returns PENDING response
        2. [Future] run_workflow()  →  executes LangGraph agent pipeline
        3. get_workflow_status()   →  queries DB/cache for current state

    Dependency injection usage (in route handlers):
        service: PlannerService = Depends(get_planner_service)
    """

    # ── Public API ────────────────────────────────────────────────────────────

    async def create_workflow(self, request: WorkflowRequest) -> WorkflowResponse:
        """
        Accept a planning request, generate a workflow ID, and return an
        initial PENDING response.

        Steps:
          1. Extra business-rule validation (beyond Pydantic)
          2. Generate UUID4 workflow ID
          3. Build the estimated step list
          4. Log the accepted request
          5. [TODO] Persist workflow record to DB
          6. [TODO] Enqueue async agent task (Celery / BackgroundTasks / LangGraph)
          7. Return WorkflowResponse(status=PENDING)

        Args:
            request: Validated WorkflowRequest from the route handler.

        Returns:
            WorkflowResponse with status=PENDING and estimated_steps populated.

        Raises:
            ValidationError: If business rules beyond Pydantic fail.
            WorkflowError:   If workflow creation itself fails unexpectedly.
        """
        # Step 1 — Extra validation
        self._validate_request(request)

        # Step 2 — Generate workflow ID
        workflow_id = str(uuid.uuid4())
        created_at = datetime.now(tz=timezone.utc)

        logger.info(
            "Workflow accepted",
            extra={
                "workflow_id": workflow_id,
                "user_id": request.user_id,
                "query_preview": request.query[:80],
            },
        )

        # Step 3 — Build estimated steps
        estimated_steps = self._build_estimated_steps(request)

        logger.debug(
            "Estimated steps calculated",
            extra={
                "workflow_id": workflow_id,
                "step_count": len(estimated_steps),
            },
        )

        # TODO: Step 5 — Persist workflow record to database
        #   await db.workflow_repo.create({
        #       "id": workflow_id,
        #       "user_id": request.user_id,
        #       "query": request.query,
        #       "status": WorkflowStatus.PENDING,
        #       "created_at": created_at,
        #   })

        # TODO: Step 6 — Enqueue async agent execution
        #   await task_queue.enqueue("run_planner_agent", workflow_id=workflow_id)
        #   OR use FastAPI BackgroundTasks:
        #   background_tasks.add_task(self._run_agent_pipeline, workflow_id, request)

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
        Retrieve the current status of an existing workflow.

        Args:
            workflow_id: UUID4 string identifying the workflow.

        Returns:
            WorkflowResponse reflecting the current DB/cache state.

        Raises:
            NotFoundError: If no workflow with this ID exists.
        """
        self._validate_workflow_id(workflow_id)

        logger.info(
            "Workflow status requested",
            extra={"workflow_id": workflow_id},
        )

        # TODO: Query database / Redis cache for workflow state
        #   record = await db.workflow_repo.get(workflow_id)
        #   if record is None:
        #       raise NotFoundError(f"Workflow '{workflow_id}' not found.")
        #   return WorkflowResponse(**record.to_dict())

        # Temporary stub — always returns NOT_FOUND until DB is wired
        raise NotFoundError(
            f"Workflow '{workflow_id}' not found. "
            "Database persistence is not yet implemented.",
            details={"workflow_id": workflow_id},
        )

    # ── Private helpers ────────────────────────────────────────────────────────

    def _validate_request(self, request: WorkflowRequest) -> None:
        """
        Apply business-rule validation beyond Pydantic field constraints.

        This is intentionally kept separate from Pydantic validators so that
        rules requiring cross-service context (e.g. checking a blocked user list,
        rate limits) can be added here without touching the schema.

        Raises:
            ValidationError: On any failed business rule.
        """
        # Rule: query must not be blank after stripping (Pydantic strips, but guard here too)
        if not request.query.strip():
            raise ValidationError(
                "Travel query must not be empty.",
                details={"field": "query"},
            )

        # Rule: if preferences are supplied, validate internal consistency
        if request.preferences is not None:
            prefs = request.preferences

            if prefs.duration_days is not None and prefs.duration_days < 1:
                raise ValidationError(
                    "Trip duration must be at least 1 day.",
                    details={"field": "preferences.duration_days", "value": prefs.duration_days},
                )

            if prefs.destinations is not None and len(prefs.destinations) == 0:
                raise ValidationError(
                    "If 'destinations' is provided it must contain at least one entry.",
                    details={"field": "preferences.destinations"},
                )

        logger.debug("Request validation passed", extra={"query_len": len(request.query)})

    def _validate_workflow_id(self, workflow_id: str) -> None:
        """
        Ensure the provided workflow_id is a valid UUID4.

        Raises:
            ValidationError: If the format is invalid.
        """
        try:
            parsed = uuid.UUID(workflow_id, version=4)
            if str(parsed) != workflow_id.lower():
                raise ValueError("UUID version mismatch")
        except ValueError:
            raise ValidationError(
                f"'{workflow_id}' is not a valid UUID4 workflow identifier.",
                details={"workflow_id": workflow_id},
            )

    def _build_estimated_steps(self, request: WorkflowRequest) -> list[str]:
        """
        Return an ordered list of planning steps the agent will execute.

        Currently static and deterministic — shaped by the presence of
        `preferences` to give callers a realistic preview of what the agent
        will do.

        TODO: Replace with dynamic step planning from the LangGraph agent
              after LLM integration:
                  steps = await planner_agent.plan_steps(request)
        """
        base_steps: list[str] = [
            "Parse and understand travel intent",
            "Identify key travel requirements and constraints",
            "Research destination highlights and attractions",
            "Draft a day-by-day itinerary",
        ]

        prefs: TravelPreferences | None = request.preferences

        # Enrich steps based on available preferences
        if prefs is not None:
            if prefs.budget is not None:
                base_steps.append(f"Tailor recommendations for a '{prefs.budget.value}' budget")

            if prefs.travel_style:
                style_str = ", ".join(prefs.travel_style)
                base_steps.append(f"Incorporate travel style preferences: {style_str}")

            if prefs.origin is not None:
                base_steps.append(f"Research transport options from {prefs.origin}")

            if prefs.destinations and len(prefs.destinations) > 1:
                base_steps.append("Optimise multi-destination routing and logistics")

        # Common closing steps
        base_steps.extend(
            [
                "Estimate costs and budget breakdown",
                "Compile local tips, cultural notes, and packing advice",
                "Assemble and format the final travel plan",
            ]
        )

        return base_steps

    # ── Future: private agent pipeline (async, called in background) ──────────

    # async def _run_agent_pipeline(
    #     self, workflow_id: str, request: WorkflowRequest
    # ) -> None:
    #     """
    #     TODO: Execute the full LangGraph agent pipeline.
    #
    #     1. Update workflow status → RUNNING
    #     2. Invoke LangGraph graph with request as initial state
    #     3. Stream intermediate steps to Redis pub/sub channel
    #     4. On completion: update status → COMPLETED, persist result
    #     5. On failure:    update status → FAILED, log error
    #     """
    #     raise NotImplementedError


# ── Dependency provider ────────────────────────────────────────────────────────

def get_planner_service() -> PlannerService:
    """
    FastAPI dependency provider.

    Usage in a route:
        @router.post("/run")
        async def run_workflow(
            request: WorkflowRequest,
            service: PlannerService = Depends(get_planner_service),
        ): ...

    TODO: When DB/LLM clients are ready, inject them here:
        def get_planner_service(
            db: AsyncSession = Depends(get_db),
            llm: ChatGoogleGenerativeAI = Depends(get_llm),
        ) -> PlannerService:
            return PlannerService(db=db, llm=llm)
    """
    return PlannerService()
