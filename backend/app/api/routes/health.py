"""Health, readiness, and metrics endpoints.

- ``GET /api/health``        liveness  — process is up, no external deps.
- ``GET /api/health/ready``  readiness — checks PostgreSQL and Redis wiring.
- ``GET /api/metrics``       Prometheus metrics.
"""
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse, PlainTextResponse
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from sqlalchemy import text

from app.core.database import engine
from app.core.redis import get_redis

router = APIRouter(tags=["health"])


@router.get("/health")
def liveness() -> dict:
    """Liveness probe: the app is running."""
    return {"status": "ok"}


@router.get("/health/ready")
def readiness() -> JSONResponse:
    """Readiness probe: reports PostgreSQL / Redis connectivity.

    Returns 200 only when every dependency is reachable, else 503.
    Never raises — a down dependency is reported, not thrown.
    """
    components: dict[str, str] = {}

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        components["database"] = "up"
    except Exception:
        components["database"] = "down"

    try:
        get_redis().ping()
        components["redis"] = "up"
    except Exception:
        components["redis"] = "down"

    ready = all(v == "up" for v in components.values())
    return JSONResponse(
        status_code=status.HTTP_200_OK if ready else status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "ready" if ready else "not_ready",
            "components": components,
        },
    )


@router.get("/metrics")
def metrics() -> PlainTextResponse:
    """Prometheus exposition endpoint."""
    return PlainTextResponse(
        content=generate_latest().decode("utf-8"),
        media_type=CONTENT_TYPE_LATEST,
    )
