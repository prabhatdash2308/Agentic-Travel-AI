from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_logger
from app.db import get_db
from app.schemas.workflow import WorkflowRequest, WorkflowResponse
from app.services.planner_service import PlannerService, get_planner_service

router = APIRouter()
logger = get_logger(__name__)


@router.post(
    "/run",
    response_model=WorkflowResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit a travel planning workflow",
    description=(
        "Accepts a free-text travel intent and optional preferences. "
        "Persists the workflow to the database as PENDING and launches the "
        "LangGraph agent pipeline asynchronously. "
        "Poll GET /api/status/{workflow_id} for progress."
    ),
)
async def run_workflow(
    request: WorkflowRequest,
    db: AsyncSession = Depends(get_db),
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    logger.info(
        "POST /api/workflow/run | user=%s query=%.60s",
        request.user_id, request.query,
    )
    return await service.create_workflow(request, db)


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Get workflow status by ID",
    description="Retrieve the current status of a workflow from the database.",
)
async def get_workflow(
    workflow_id: str,
    db: AsyncSession = Depends(get_db),
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    logger.info("GET /api/workflow/%s", workflow_id)
    return await service.get_workflow_status(workflow_id, db)
