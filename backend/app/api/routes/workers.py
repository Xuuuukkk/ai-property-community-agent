"""Worker management endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.worker import Worker
from app.schemas.worker import WorkerResponse

router = APIRouter(prefix="/workers", tags=["workers"])


@router.get("", response_model=list[WorkerResponse])
def list_workers(
    status: str | None = Query(None, description="Filter by worker status, e.g. ON_DUTY"),
    department: str | None = Query(None, description="Filter by department"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Worker]:
    """List all workers with optional filters.

    Requires authentication. Returns basic profile and contact info so
    management can assign repair orders.
    """
    query = db.query(Worker).options(selectinload(Worker.user))
    if status:
        query = query.filter(Worker.status == status)
    if department:
        query = query.filter(Worker.department == department)
    return query.order_by(Worker.id).all()
