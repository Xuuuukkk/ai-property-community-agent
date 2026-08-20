"""Fee bill API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.fee import FeeBulkCreate, FeeBillResponse, FeeCreate, FeeListResponse
from app.services.fee import fee_service

router = APIRouter(prefix="/fee", tags=["fee"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.get("", response_model=FeeListResponse)
def list_all_fees(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status_: str | None = Query(None, alias="status", description="Filter by bill status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeeListResponse:
    """Return a paginated list of all fee bills (management only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    items, total = fee_service.list_all_fees(
        db, page=page, page_size=page_size, fee_status=status_
    )
    pages = (total + page_size - 1) // page_size
    return FeeListResponse(
        items=items,
        pagination=PageInfo(page=page, page_size=page_size, total=total, pages=pages),
    )


@router.post("", response_model=FeeBillResponse, status_code=201)
def create_fee(
    payload: FeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeeBillResponse:
    """Create a single fee bill (management only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return fee_service.create_fee(db, payload=payload)


@router.post("/bulk", response_model=list[FeeBillResponse], status_code=201)
def bulk_create_fees(
    payload: FeeBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[FeeBillResponse]:
    """Create multiple fee bills in one request (management only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="items must not be empty",
        )
    return fee_service.bulk_create_fees(db, items=payload.items)


@router.post("/{fee_id}/mark-paid", response_model=FeeBillResponse)
def mark_fee_paid(
    fee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeeBillResponse:
    """Mark a fee bill as paid (management confirms offline payment)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return fee_service.mark_paid(db, fee_id=fee_id)


@router.get("/{user_id}", response_model=FeeListResponse)
def list_fees_by_user(
    user_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeeListResponse:
    """Return a paginated list of fee bills for a given user.

    Owners may only view their own bills; property staff and admins may view
    any user's bills.
    """
    if current_user.role not in _STAFF_ROLES and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    items, total = fee_service.list_fees_by_user(
        db,
        user_id=user_id,
        page=page,
        page_size=page_size,
    )
    pages = (total + page_size - 1) // page_size
    return FeeListResponse(
        items=items,
        pagination=PageInfo(
            page=page,
            page_size=page_size,
            total=total,
            pages=pages,
        ),
    )
