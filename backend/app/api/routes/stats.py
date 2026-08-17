"""Dashboard statistics API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.stats import get_dashboard_stats

router = APIRouter(prefix="/stats", tags=["stats"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.get("/dashboard")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Aggregated management statistics (staff/admin only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return get_dashboard_stats(db)
