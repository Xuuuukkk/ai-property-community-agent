"""Worker management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.worker import Worker
from app.schemas.worker import WorkerResponse

router = APIRouter(prefix="/workers", tags=["workers"])


_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


_STATUS_MAP = {
    "ON_DUTY": "在岗",
    "OFF_DUTY": "离岗",
    "ON_LEAVE": "休假",
}

_DEPT_MAP = {
    "management": "物业管理部",
    "engineering": "工程维修部",
    "cleaning": "清洁绿化部",
    "security": "安保秩序部",
}


@router.get("", response_model=list[WorkerResponse])
def list_workers(
    status: str | None = Query(None, description="Filter by worker status, e.g. ON_DUTY or 在岗"),
    department: str | None = Query(None, description="Filter by department, e.g. engineering or 工程维修部"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Worker]:
    """List all workers with optional filters (management-only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    query = db.query(Worker).options(selectinload(Worker.user))
    if status:
        query = query.filter(Worker.status == _STATUS_MAP.get(status, status))
    if department:
        query = query.filter(Worker.department == _DEPT_MAP.get(department, department))
    return query.order_by(Worker.id).all()
