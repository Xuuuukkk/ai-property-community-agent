"""Data maintenance API endpoints (manual cleanup trigger)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.maintenance import run_maintenance

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.post("/cleanup")
def trigger_cleanup(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Manually run a full cleanup pass (admin only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return {"cleaned": run_maintenance(db)}
