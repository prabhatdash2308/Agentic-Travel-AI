from fastapi import APIRouter

router = APIRouter()


@router.get("/{workflow_id}")
async def get_status(workflow_id: str):
    # TODO: query DB for workflow status
    return {"workflow_id": workflow_id, "status": "pending"}
