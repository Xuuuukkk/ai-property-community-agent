"""FastAPI application entrypoint.

Phase 1: Backend foundation — app factory, health routes, config wiring.
Business routers (user/repair/fee/notice) are added in Phase 3.
"""
from fastapi import FastAPI

from app.api.routes import (
    agent_router,
    fee_router,
    health_router,
    notices_router,
    repair_router,
    users_router,
)
from app.core.config import get_settings

settings = get_settings()


def create_app() -> FastAPI:
    """Application factory."""
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="AI Property Community Agent - Backend API",
    )

    # Health & readiness under /api
    app.include_router(health_router, prefix=settings.API_PREFIX)

    # Phase 3 business routers
    app.include_router(users_router, prefix=settings.API_PREFIX)
    app.include_router(repair_router, prefix=settings.API_PREFIX)
    app.include_router(fee_router, prefix=settings.API_PREFIX)
    app.include_router(notices_router, prefix=settings.API_PREFIX)

    # Phase 5 AI Agent router
    app.include_router(agent_router, prefix=settings.API_PREFIX)

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
