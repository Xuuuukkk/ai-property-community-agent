"""Repair order API endpoints."""

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import PageInfo
from app.schemas.repair import RepairCreate, RepairListResponse, RepairResponse
from app.services.repair import repair_service

router = APIRouter(prefix="/repair", tags=["repair"])


class RepairAssignPayload(BaseModel):
    worker_id: int


class RepairStatusPayload(BaseModel):
    status: str


@router.get("/list", response_model=RepairListResponse)
def list_repairs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    user_id: int | None = Query(None, description="Filter by reporter user ID"),
    worker_id: int | None = Query(None, description="Filter by assigned worker ID"),
    status: str | None = Query(None, description="Filter by repair status"),
    db: Session = Depends(get_db),
) -> RepairListResponse:
    """Return a paginated list of repair orders with optional filters."""
    items, total = repair_service.list_repairs(
        db,
        page=page,
        page_size=page_size,
        user_id=user_id,
        worker_id=worker_id,
        status=status,
    )
    pages = (total + page_size - 1) // page_size
    return RepairListResponse(
        items=items,
        pagination=PageInfo(
            page=page,
            page_size=page_size,
            total=total,
            pages=pages,
        ),
    )


@router.post("", response_model=RepairResponse, status_code=201)
def create_repair(
    payload: RepairCreate,
    db: Session = Depends(get_db),
) -> RepairResponse:
    """Create a new repair order."""
    return repair_service.create_repair(db, payload=payload)


@router.get("/{repair_id}", response_model=RepairResponse)
def get_repair(repair_id: int, db: Session = Depends(get_db)) -> RepairResponse:
    """Return a single repair order by ID."""
    return repair_service.get_repair(db, repair_id)


@router.post("/{repair_id}/assign", response_model=RepairResponse)
def assign_repair_worker(
    repair_id: int,
    payload: RepairAssignPayload,
    db: Session = Depends(get_db),
) -> RepairResponse:
    """Assign a worker to a repair order."""
    repair = repair_service.get_repair(db, repair_id)
    repair.worker_id = payload.worker_id
    repair.status = "ASSIGNED"
    db.commit()
    db.refresh(repair)
    return repair_service.get_repair(db, repair_id)


@router.post("/{repair_id}/status", response_model=RepairResponse)
def update_repair_status(
    repair_id: int,
    payload: RepairStatusPayload,
    db: Session = Depends(get_db),
) -> RepairResponse:
    """Update the status of a repair order."""
    repair = repair_service.get_repair(db, repair_id)
    repair.status = payload.status
    if payload.status == "COMPLETED":
        from datetime import datetime
        repair.completed_at = datetime.now()
    db.commit()
    db.refresh(repair)
    return repair_service.get_repair(db, repair_id)


@router.post("/{repair_id}/owner-confirm", response_model=RepairResponse)
def owner_confirm_repair(
    repair_id: int,
    db: Session = Depends(get_db),
) -> RepairResponse:
    """Owner confirms the repair is finished.

    The order is only marked COMPLETED when both owner and worker confirm.
    """
    return repair_service.confirm_by_owner(db, repair_id)


@router.post("/{repair_id}/worker-confirm", response_model=RepairResponse)
def worker_confirm_repair(
    repair_id: int,
    db: Session = Depends(get_db),
) -> RepairResponse:
    """Worker confirms the repair is finished.

    The order is only marked COMPLETED when both owner and worker confirm.
    """
    return repair_service.confirm_by_worker(db, repair_id)
