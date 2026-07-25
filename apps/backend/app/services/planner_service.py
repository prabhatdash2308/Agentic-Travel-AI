from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone

from langchain_google_genai import ChatGoogleGenerativeAI

from app.agent.graph import build_planner_graph
from app.agent.store import workflow_store
from app.core import get_logger, NotFoundError, ValidationError, WorkflowError
from app.core.config import settings
from app.schemas.workflow import (
    TravelPreferences,
    WorkflowRequest,
    WorkflowResponse,
    WorkflowStatus,
)

logger = get_logger(__name__)


def _build_llm() -> ChatGoogleGenerativeAI:
    """Instantiate the Google Generative AI LLM client from settings."""
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_MODEL,
        temperature=settings.LLM_TEMPERATURE,
        google_api_key=settings.GOOGLE_API_KEY,
    )


class PlannerService:
    """
    Orchestrates travel planning workflows via LangGraph + Google Gemini.

    Lifecycle:
        1. create_workflow()        — validate, assign UUID, persist PENDING, kick off background task
        2. _run_agent_pipeline()    — executes the LangGraph graph (async background)
        3. get_workflow_status()    — reads current state from WorkflowStore
    """

    def __init__(self) -> None:
        if settings.llm_configured:
            self._llm = _build_llm()
            self._graph = build_planner_graph(self._llm)
            logger.info("LLM configured | model=%s", settings.GEMINI_MODEL)
        else:
            self._llm = None
            self._graph = None
            logger.warning(
                "GOOGLE_API_KEY not set — LLM pipeline disabled. "
                "Workflows will stay in PENDING state."
            )

    # ── Public API ────────────────────────────────────────────────────────────

    async def create_workflow(self, request: WorkflowRequest) -> WorkflowResponse:
        """
        Accept a planning request, persist it as PENDING, launch the agent
        pipeline in the background, and return immediately.
        """
        self._validate_request(request)

        workflow_id = str(uuid.uuid4())
        created_at = datetime.now(tz=timezone.utc)
        estimated_steps = self._build_estimated_steps(request)

        logger.info(
            "Workflow accepted | id=%s user=%s query=%.80s",
            workflow_id, request.user_id, request.query,
        )

        record = {
            "workflow_id": workflow_id,
            "status": WorkflowStatus.PENDING,
            "message": (
                f"Workflow '{workflow_id}' accepted and queued for planning. "
                "Poll /api/status/{workflow_id} for updates."
            ),
            "created_at": created_at,
            "estimated_steps": estimated_steps,
            "final_plan": None,
            "completed_steps": [],
            "error": None,
        }
        await workflow_store.create(record)

        # Fire-and-forget: run the LangGraph pipeline asynchronously
        asyncio.create_task(
            self._run_agent_pipeline(workflow_id, request),
            name=f"planner-{workflow_id[:8]}",
        )

        return workflow_store.to_response(record)

    async def get_workflow_status(self, workflow_id: str) -> WorkflowResponse:
        """
        Return the latest state of a workflow from the in-memory store.

        Raises:
            ValidationError: workflow_id is not a valid UUID4.
            NotFoundError:   no record found for this ID.
        """
        self._validate_workflow_id(workflow_id)

        record = await workflow_store.get(workflow_id)
        if record is None:
            raise NotFoundError(
                f"Workflow '{workflow_id}' not found.",
                details={"workflow_id": workflow_id},
            )

        logger.debug("Status polled | id=%s status=%s", workflow_id, record["status"])
        return workflow_store.to_response(record)

    # ── Agent pipeline ────────────────────────────────────────────────────────

    async def _run_agent_pipeline(
        self, workflow_id: str, request: WorkflowRequest
    ) -> None:
        """
        Execute the full LangGraph planning pipeline for a workflow.

        Steps:
          1. Mark status → RUNNING
          2. Build the initial LangGraph state from the request
          3. Invoke the compiled graph (ainvoke streams through all nodes)
          4. On success: persist final_plan + completed_steps → COMPLETED
          5. On error:   persist error message → FAILED
        """
        if self._graph is None:
            logger.warning(
                "Agent pipeline skipped (LLM not configured) | id=%s", workflow_id
            )
            await workflow_store.update(
                workflow_id,
                status=WorkflowStatus.FAILED,
                message="LLM not configured. Set GOOGLE_API_KEY in .env to enable AI planning.",
                error="GOOGLE_API_KEY missing",
            )
            return

        # Step 1 — Mark RUNNING
        await workflow_store.update(
            workflow_id,
            status=WorkflowStatus.RUNNING,
            message=f"Workflow '{workflow_id}' is running.",
        )
        logger.info("Agent pipeline started | id=%s", workflow_id)

        try:
            # Step 2 — Build initial state
            prefs: TravelPreferences | None = request.preferences
            initial_state = {
                "query": request.query,
                "user_id": request.user_id,
                "budget": prefs.budget.value if (prefs and prefs.budget) else None,
                "travel_style": prefs.travel_style or [] if prefs else [],
                "duration_days": prefs.duration_days if prefs else None,
                "origin": prefs.origin if prefs else None,
                "destinations": prefs.destinations or [] if prefs else [],
                # Intermediate outputs (empty — filled by nodes)
                "parsed_intent": "",
                "requirements": "",
                "destination_research": "",
                "itinerary_draft": "",
                "cost_estimate": "",
                "tips": "",
                "final_plan": "",
                "completed_steps": [],
                "errors": [],
            }

            # Step 3 — Run the graph
            final_state = await self._graph.ainvoke(initial_state)

            # Step 4 — Persist success
            await workflow_store.update(
                workflow_id,
                status=WorkflowStatus.COMPLETED,
                message=f"Workflow '{workflow_id}' completed successfully.",
                final_plan=final_state.get("final_plan", ""),
                completed_steps=final_state.get("completed_steps", []),
            )
            logger.info(
                "Agent pipeline completed | id=%s steps=%d",
                workflow_id,
                len(final_state.get("completed_steps", [])),
            )

        except Exception as exc:  # noqa: BLE001
            # Step 5 — Persist failure
            logger.exception("Agent pipeline failed | id=%s error=%s", workflow_id, exc)
            await workflow_store.update(
                workflow_id,
                status=WorkflowStatus.FAILED,
                message=f"Workflow '{workflow_id}' failed during planning.",
                error=str(exc),
            )

    # ── Private helpers ───────────────────────────────────────────────────────

    def _validate_request(self, request: WorkflowRequest) -> None:
        if not request.query.strip():
            raise ValidationError("Travel query must not be empty.", details={"field": "query"})

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
        steps: list[str] = [
            "Parse and understand travel intent",
            "Identify key requirements and constraints",
            "Research destination highlights and attractions",
            "Draft a day-by-day itinerary",
        ]
        prefs = request.preferences
        if prefs:
            if prefs.budget:
                steps.append(f"Tailor recommendations for a '{prefs.budget.value}' budget")
            if prefs.travel_style:
                steps.append("Incorporate travel style preferences: " + ", ".join(prefs.travel_style))
            if prefs.origin:
                steps.append(f"Research transport options from {prefs.origin}")
            if prefs.destinations and len(prefs.destinations) > 1:
                steps.append("Optimise multi-destination routing and logistics")
        steps.extend([
            "Estimate costs and budget breakdown",
            "Compile local tips, cultural notes, and packing advice",
            "Assemble and format the final travel plan",
        ])
        return steps


def get_planner_service() -> PlannerService:
    """
    FastAPI dependency provider.
    Returns the module-level singleton to avoid rebuilding the LLM/graph per request.
    """
    return _planner_service_singleton


# Module-level singleton — built once at import time
_planner_service_singleton = PlannerService()
