"""FastAPI application entrypoint.

Phase 1: Backend foundation — app factory, health routes, config wiring.
Business routers (user/repair/fee/notice) are added in Phase 3.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    agent_router,
    auth_router,
    fee_router,
    health_router,
    inspection_router,
    issue_router,
    knowledge_router,
    notices_router,
    repair_router,
    users_router,
    workers_router,
)
from app.core.config import get_settings
from app.core.logging import RequestLoggingMiddleware, configure_logging

settings = get_settings()

# Configure logging once at import time so it applies to all workers.
configure_logging()


def create_app() -> FastAPI:
    """Application factory."""
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="AI Property Community Agent - Backend API",
    )

    # CORS — origins are controlled via the BACKEND_CORS_ORIGINS env variable.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Log every request with timing and status code.
    app.add_middleware(RequestLoggingMiddleware)

    # Health & readiness under /api
    app.include_router(health_router, prefix=settings.API_PREFIX)

    # Authentication
    app.include_router(auth_router, prefix=settings.API_PREFIX)

    # Phase 3 business routers
    app.include_router(users_router, prefix=settings.API_PREFIX)
    app.include_router(workers_router, prefix=settings.API_PREFIX)
    app.include_router(repair_router, prefix=settings.API_PREFIX)
    app.include_router(fee_router, prefix=settings.API_PREFIX)
    app.include_router(notices_router, prefix=settings.API_PREFIX)

    # Phase 5 AI Agent router
    app.include_router(agent_router, prefix=settings.API_PREFIX)

    # Phase 6 RAG knowledge router
    app.include_router(knowledge_router, prefix=settings.API_PREFIX)

    # Automated patrol inspection router
    app.include_router(inspection_router, prefix=settings.API_PREFIX)

    # Owner-submitted issue reports router
    app.include_router(issue_router, prefix=settings.API_PREFIX)

    @app.get("/", tags=["root"])
    def root() -> dict:
        return {
            "app": settings.APP_NAME,
            "env": settings.APP_ENV,
            "docs": "/docs",
            "health": f"{settings.API_PREFIX}/health",
        }

    return app


app = create_app()
