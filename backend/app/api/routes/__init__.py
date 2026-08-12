"""API route modules."""

from app.api.routes.agent import router as agent_router
from app.api.routes.fee import router as fee_router
from app.api.routes.health import router as health_router
from app.api.routes.notices import router as notices_router
from app.api.routes.repair import router as repair_router
from app.api.routes.users import router as users_router

__all__ = [
    "agent_router",
    "fee_router",
    "health_router",
    "notices_router",
    "repair_router",
    "users_router",
]
