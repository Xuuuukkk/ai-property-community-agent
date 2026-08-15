"""Fee bill API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.fee import FeeListResponse
from app.services.fee import fee_service

router = APIRouter(prefix="/fee", tags=["fee"])


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
    if current_user.role not in ("ADMIN", "PROPERTY_STAFF") and current_user.id != user_id:
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
