from fastapi import APIRouter
from app.schemas.workflow import WorkflowRequest, WorkflowResponse

router = APIRouter()


@router.post("/run", response_model=WorkflowResponse)
async def run_workflow(request: WorkflowRequest):
    # TODO: wire up to planner_service
    return WorkflowResponse(workflow_id="wf-placeholder", status="pending")
