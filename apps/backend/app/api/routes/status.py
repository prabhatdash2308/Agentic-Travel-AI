"""
app/api/routes/status.py
-------------------------
GET /api/status/{workflow_id}

Convenience alias for the workflow status endpoint.
Delegates entirely to PlannerService so there is a single source of truth.
"""

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
    description=(
        "Alias for GET /api/workflow/{workflow_id}. "
        "Returns the current lifecycle status of a planning workflow."
    ),
    responses={
        200: {"description": "Workflow found"},
        404: {"description": "Workflow not found"},
        422: {"description": "Invalid workflow ID format"},
    },
)
async def get_status(
    workflow_id: str,
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    """
    Poll the status of a workflow by its UUID.

    Intended to be called repeatedly by clients after submitting a workflow
    until status transitions from `pending` → `running` → `completed`/`failed`.
    """
    logger.info(
        "GET /api/status/{workflow_id}",
        extra={"workflow_id": workflow_id},
    )
    return await service.get_workflow_status(workflow_id)
