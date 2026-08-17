"""API route modules."""

from app.api.routes.agent import router as agent_router
from app.api.routes.auth import router as auth_router
from app.api.routes.fee import router as fee_router
from app.api.routes.feedback import router as feedback_router
from app.api.routes.health import router as health_router
from app.api.routes.inspection import router as inspection_router
from app.api.routes.issue import router as issue_router
from app.api.routes.knowledge import router as knowledge_router
from app.api.routes.maintenance import router as maintenance_router
from app.api.routes.notices import router as notices_router
from app.api.routes.repair import router as repair_router
from app.api.routes.stats import router as stats_router
from app.api.routes.users import router as users_router
from app.api.routes.workers import router as workers_router

__all__ = [
    "agent_router",
    "auth_router",
    "fee_router",
    "feedback_router",
    "health_router",
    "inspection_router",
    "issue_router",
    "knowledge_router",
    "maintenance_router",
    "notices_router",
    "repair_router",
    "stats_router",
    "users_router",
    "workers_router",
]
