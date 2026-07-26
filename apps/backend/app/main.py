from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import router
from app.db import create_all_tables
from app.core import (
    AgenticBaseError,
    NotFoundError,
    ValidationError,
    WorkflowError,
    get_logger,
    settings,
)

logger = get_logger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "**Eagle Agentic AI** — AI-powered travel planning backend.\n\n"
            "Submit a natural-language travel request and receive a structured "
            "day-by-day itinerary from an autonomous planning agent."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        debug=settings.DEBUG,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    _register_exception_handlers(app)
    app.include_router(router, prefix="/api")

    @app.on_event("startup")
    async def on_startup() -> None:
        await create_all_tables()
        logger.info(
            "🚀 %s v%s | env=%s log_level=%s",
            settings.APP_NAME,
            settings.APP_VERSION,
            settings.APP_ENV,
            settings.LOG_LEVEL,
        )

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("🛑 %s shutting down.", settings.APP_NAME)

    return app


def _register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(ValidationError)
    async def handle_validation(request: Request, exc: ValidationError) -> JSONResponse:
        logger.warning("ValidationError on %s: %s", request.url.path, exc.message)
        return JSONResponse(status_code=exc.status_code, content=exc.to_dict())

    @app.exception_handler(NotFoundError)
    async def handle_not_found(request: Request, exc: NotFoundError) -> JSONResponse:
        logger.info("NotFoundError on %s: %s", request.url.path, exc.message)
        return JSONResponse(status_code=exc.status_code, content=exc.to_dict())

    @app.exception_handler(WorkflowError)
    async def handle_workflow(request: Request, exc: WorkflowError) -> JSONResponse:
        logger.error("WorkflowError on %s: %s", request.url.path, exc.message)
        return JSONResponse(status_code=exc.status_code, content=exc.to_dict())

    @app.exception_handler(AgenticBaseError)
    async def handle_agentic_base(request: Request, exc: AgenticBaseError) -> JSONResponse:
        logger.warning("AgenticBaseError [%s] on %s: %s", exc.error_code, request.url.path, exc.message)
        return JSONResponse(status_code=exc.status_code, content=exc.to_dict())

    @app.exception_handler(Exception)
    async def handle_unhandled(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception on %s", request.url.path)
        return JSONResponse(
            status_code=500,
            content={"error_code": "INTERNAL_ERROR", "message": "An unexpected error occurred."},
        )


app = create_app()


@app.get("/", tags=["Root"], summary="Root health check")
async def root() -> dict:
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.APP_ENV,
    }