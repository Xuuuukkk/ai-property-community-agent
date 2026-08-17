"""Dashboard statistics API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.insights import generate_report, get_insights
from app.services.stats import get_dashboard_stats

router = APIRouter(prefix="/stats", tags=["stats"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


def _require_staff(user: User) -> None:
    if user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")


@router.get("/dashboard")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Aggregated management statistics (staff/admin only)."""
    _require_staff(current_user)
    return get_dashboard_stats(db)


@router.get("/insights")
def dashboard_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Rule-based findings plus an LLM-generated summary report (staff only)."""
    _require_staff(current_user)
    return {
        "insights": get_insights(db),
        "report": generate_report(db),
    }
