from fastapi import APIRouter
from app.api.routes import health, chat, workflow, status

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(chat.router, prefix="/chat", tags=["Chat"])
router.include_router(workflow.router, prefix="/workflow", tags=["Workflow"])
router.include_router(status.router, prefix="/status", tags=["Status"])
