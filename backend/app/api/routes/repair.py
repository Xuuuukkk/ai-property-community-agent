"""Repair order API endpoints."""

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.repair import RepairCreate, RepairListResponse, RepairResponse
from app.services.repair import repair_service

router = APIRouter(prefix="/repair", tags=["repair"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


class RepairAssignPayload(BaseModel):
    worker_id: int


class RepairStatusPayload(BaseModel):
    status: str


def _staff_or_owner_or_worker(current_user: User) -> None:
    """Raise 403 unless the user is staff/admin (or owner/worker handled by caller)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )


def _worker_id_of(current_user: User) -> int | None:
    """Return the worker id linked to a user, if any."""
    profile = getattr(current_user, "worker_profile", None)
    return profile.id if profile else None


def _assert_can_access_order(current_user: User, repair) -> None:
    """Ensure the user may view/act on this order (owner, its worker, or staff)."""
    if current_user.role in _STAFF_ROLES:
        return
    if current_user.role == "OWNER" and repair.user_id == current_user.id:
        return
    if current_user.role == "WORKER" and repair.worker_id == _worker_id_of(current_user):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Insufficient permissions",
    )


@router.get("/list", response_model=RepairListResponse)
def list_repairs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    user_id: int | None = Query(None, description="Filter by reporter user ID"),
    worker_id: int | None = Query(None, description="Filter by assigned worker ID"),
    status: str | None = Query(None, description="Filter by repair status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepairListResponse:
    """Return a paginated list of repair orders with optional filters.

    Owners and workers are restricted to their own orders; staff/admin may
    filter across all orders.
    """
    if current_user.role == "OWNER":
        user_id = current_user.id
        worker_id = None
    elif current_user.role == "WORKER":
        user_id = None
        worker_id = _worker_id_of(current_user)

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
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Create a new repair order.

    Owners may only create orders for themselves; staff/admin may create for
    any user.
    """
    if current_user.role == "OWNER":
        payload.user_id = current_user.id
    elif current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return repair_service.create_repair(db, payload=payload)


@router.get("/{repair_id}", response_model=RepairResponse)
def get_repair(
    repair_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Return a single repair order by ID (owner/worker/staff access only)."""
    repair = repair_service.get_repair(db, repair_id)
    _assert_can_access_order(current_user, repair)
    return repair


@router.post("/{repair_id}/assign", response_model=RepairResponse)
def assign_repair_worker(
    repair_id: int,
    payload: RepairAssignPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Assign a worker to a repair order (staff/admin only)."""
    _staff_or_owner_or_worker(current_user)
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
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Update the status of a repair order (staff or its assigned worker)."""
    repair = repair_service.get_repair(db, repair_id)
    if current_user.role == "WORKER":
        if repair.worker_id != _worker_id_of(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
    elif current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
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
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Owner confirms the repair is finished (owner of the order only).

    The order is only marked COMPLETED when both owner and worker confirm.
    """
    repair = repair_service.get_repair(db, repair_id)
    if current_user.role != "OWNER" or repair.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return repair_service.confirm_by_owner(db, repair_id)


@router.post("/{repair_id}/worker-confirm", response_model=RepairResponse)
def worker_confirm_repair(
    repair_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepairResponse:
    """Worker confirms the repair is finished (assigned worker only).

    The order is only marked COMPLETED when both owner and worker confirm.
    """
    repair = repair_service.get_repair(db, repair_id)
    if current_user.role != "WORKER" or repair.worker_id != _worker_id_of(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return repair_service.confirm_by_worker(db, repair_id)
