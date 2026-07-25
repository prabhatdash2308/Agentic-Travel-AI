from pydantic import BaseModel


class WorkflowRequest(BaseModel):
    query: str
    user_id: str | None = None


class WorkflowResponse(BaseModel):
    workflow_id: str
    status: str
