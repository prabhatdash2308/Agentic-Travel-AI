from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # TODO: wire up to planner_service
    return ChatResponse(reply="Hello from chat!")
