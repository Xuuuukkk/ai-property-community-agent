"""Repair order API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import PageInfo
from app.schemas.repair import RepairCreate, RepairListResponse, RepairResponse
from app.services.repair import repair_service

router = APIRouter(prefix="/repair", tags=["repair"])


@router.get("/list", response_model=RepairListResponse)
def list_repairs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    user_id: int | None = Query(None, description="Filter by reporter user ID"),
    status: str | None = Query(None, description="Filter by repair status"),
    db: Session = Depends(get_db),
) -> RepairListResponse:
    """Return a paginated list of repair orders with optional filters."""
    items, total = repair_service.list_repairs(
        db,
        page=page,
        page_size=page_size,
        user_id=user_id,
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
