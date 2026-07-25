"""
app/api/routes/workflow.py
---------------------------
Route handlers for /api/workflow.

POST /api/workflow/run      — submit a new travel planning request
GET  /api/workflow/{id}     — retrieve status of an existing workflow
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.core import get_logger
from app.core.exceptions import AgenticBaseError
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
        "Accepts a free-text travel intent and optional structured preferences. "
        "Returns a workflow ID and estimated planning steps immediately (status=pending). "
        "The planning agent will process the request asynchronously."
    ),
    responses={
        202: {"description": "Workflow accepted and queued"},
        422: {"description": "Request validation failed"},
        500: {"description": "Internal workflow creation error"},
    },
)
async def run_workflow(
    request: WorkflowRequest,
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    """
    Submit a new travel planning workflow.

    The endpoint returns **202 Accepted** (not 200) because the actual
    AI planning work happens asynchronously.  Poll `GET /api/status/{workflow_id}`
    for progress updates.
    """
    logger.info(
        "POST /api/workflow/run received",
        extra={"user_id": request.user_id, "query_preview": request.query[:60]},
    )
    return await service.create_workflow(request)


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Get workflow status by ID",
    description="Retrieve the current status and result of a previously submitted workflow.",
    responses={
        200: {"description": "Workflow found"},
        404: {"description": "Workflow not found"},
        422: {"description": "Invalid workflow ID format"},
    },
)
async def get_workflow(
    workflow_id: str,
    service: PlannerService = Depends(get_planner_service),
) -> WorkflowResponse:
    """
    Retrieve the status of an existing workflow.

    Returns the latest state including status, any results produced so far,
    and the full estimated step list.
    """
    logger.info(
        "GET /api/workflow/{workflow_id}",
        extra={"workflow_id": workflow_id},
    )
    return await service.get_workflow_status(workflow_id)
