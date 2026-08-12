"""Fee bill API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
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
) -> FeeListResponse:
    """Return a paginated list of fee bills for a given user."""
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
