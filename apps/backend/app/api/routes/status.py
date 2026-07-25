from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.core import get_logger
from app.schemas.workflow import WorkflowResponse
from app.services.planner_service import PlannerService, get_planner_service

router = APIRouter()
logger = get_logger(__name__)


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Poll workflow status",
    description="Returns the current lifecycle state of a planning workflow.",
)
async def get_status(
    workflow_id: str,
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    logger.info("GET /api/status/%s", workflow_id)
    return await service.get_workflow_status(workflow_id)
