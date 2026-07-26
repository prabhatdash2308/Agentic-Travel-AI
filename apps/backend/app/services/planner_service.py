from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone

from langchain_groq import ChatGroq
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent.graph import build_planner_graph
from app.core import get_logger, NotFoundError, ValidationError, WorkflowError
from app.core.config import settings
from app.db import AsyncSessionLocal
from app.db.repository import WorkflowRepository
from app.schemas.workflow import (
    TravelPreferences,
    WorkflowRequest,
    WorkflowResponse,
    WorkflowStatus,
)

logger = get_logger(__name__)


def _build_llm() -> ChatGroq:
    return ChatGroq(
        model=settings.GROQ_MODEL,
        temperature=settings.LLM_TEMPERATURE,
        groq_api_key=settings.GROQ_API_KEY,
    )


class PlannerService:
    """
    Orchestrates travel planning workflows via LangGraph + Google Gemini.
    Persists all workflow state to the database via WorkflowRepository.

    Lifecycle:
        1. create_workflow()      — validate, INSERT as PENDING, fire background task
        2. _run_agent_pipeline()  — execute LangGraph graph, UPDATE status throughout
        3. get_workflow_status()  — SELECT from DB and return latest state
    """

    def __init__(self) -> None:
        if settings.llm_configured:
            self._llm = _build_llm()
            self._graph = build_planner_graph(self._llm)
            logger.info("LLM configured | model=%s", settings.GROQ_MODEL)
        else:
            self._llm = None
            self._graph = None
            logger.warning(
                "GROQ_API_KEY not set — LLM pipeline disabled. "
                "Workflows will stay in PENDING state."
            )

    # ── Public API ────────────────────────────────────────────────────────────

    async def create_workflow(
        self,
        request: WorkflowRequest,
        db: AsyncSession,
    ) -> WorkflowResponse:
        """
        Validate the request, INSERT a PENDING workflow record, fire the
        LangGraph pipeline as an asyncio background task, and return immediately.
        """
        self._validate_request(request)

        workflow_id = str(uuid.uuid4())
        estimated_steps = self._build_estimated_steps(request)

        logger.info(
            "Workflow accepted | id=%s user=%s query=%.80s",
            workflow_id, request.user_id, request.query,
        )

        repo = WorkflowRepository(db)
        record = await repo.create(
            workflow_id=workflow_id,
            user_id=request.user_id,
            query=request.query,
            status=WorkflowStatus.PENDING,
            estimated_steps=estimated_steps,
        )
        await db.commit()
        await db.refresh(record)

        response = WorkflowRepository.to_response(record)

        # Fire-and-forget — the agent runs outside the request/response cycle
        asyncio.create_task(
            self._run_agent_pipeline(workflow_id, request),
            name=f"planner-{workflow_id[:8]}",
        )

        return response

    async def get_workflow_status(
        self,
        workflow_id: str,
        db: AsyncSession,
    ) -> WorkflowResponse:
        """
        SELECT the workflow record from the DB and return its current state.

        Raises:
            ValidationError: workflow_id is not a valid UUID4.
            NotFoundError:   no record found for this ID.
        """
        self._validate_workflow_id(workflow_id)

        repo = WorkflowRepository(db)
        record = await repo.get(workflow_id)
        if record is None:
            raise NotFoundError(
                f"Workflow '{workflow_id}' not found.",
                details={"workflow_id": workflow_id},
            )

        logger.debug("Status polled | id=%s status=%s", workflow_id, record.status)
        return WorkflowRepository.to_response(record)

    # ── Agent pipeline ────────────────────────────────────────────────────────

    async def _run_agent_pipeline(
        self, workflow_id: str, request: WorkflowRequest
    ) -> None:
        """
        Execute the full LangGraph planning pipeline in a background task.
        Opens its own DB session — independent of the original request session.

        Steps:
          1. UPDATE status → RUNNING
          2. Build initial LangGraph state
          3. ainvoke the compiled graph
          4. UPDATE status → COMPLETED + persist final_plan + completed_steps
          5. On any exception → UPDATE status → FAILED + persist error_message
        """
        async with AsyncSessionLocal() as db:
            repo = WorkflowRepository(db)

            if self._graph is None:
                await repo.update_status(
                    workflow_id,
                    status=WorkflowStatus.FAILED,
                    error_message="GROQ_API_KEY not configured. Set it in .env to enable AI planning.",
                )
                await db.commit()
                logger.warning("Agent pipeline skipped (LLM not configured) | id=%s", workflow_id)
                return

            # Step 1 — RUNNING
            await repo.update_status(workflow_id, status=WorkflowStatus.RUNNING)
            await db.commit()
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

                # Step 3 — Run the LangGraph graph
                final_state = await self._graph.ainvoke(initial_state)

                # Step 4 — COMPLETED
                await repo.update_status(
                    workflow_id,
                    status=WorkflowStatus.COMPLETED,
                    completed_steps=final_state.get("completed_steps", []),
                    final_plan=final_state.get("final_plan", ""),
                )
                await db.commit()
                logger.info(
                    "Agent pipeline completed | id=%s steps=%d",
                    workflow_id,
                    len(final_state.get("completed_steps", [])),
                )

            except Exception as exc:  # noqa: BLE001
                # Step 5 — FAILED
                logger.exception("Agent pipeline failed | id=%s", workflow_id)
                try:
                    await repo.update_status(
                        workflow_id,
                        status=WorkflowStatus.FAILED,
                        error_message=str(exc),
                    )
                    await db.commit()
                except Exception:
                    logger.exception("Failed to persist FAILED status | id=%s", workflow_id)

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
    """Return the module-level singleton (LLM + graph built once at startup)."""
    return _planner_service_singleton


_planner_service_singleton = PlannerService()
