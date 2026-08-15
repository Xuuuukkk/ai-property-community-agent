"""Notice API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.notice import NoticeCreate, NoticeListResponse, NoticeResponse
from app.services.notice import notice_service

router = APIRouter(prefix="/notices", tags=["notices"])


@router.get("", response_model=NoticeListResponse)
def list_notices(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status: str | None = Query(None, description="Filter by notice status"),
    db: Session = Depends(get_db),
) -> NoticeListResponse:
    """Return a paginated list of community notices (public)."""
    items, total = notice_service.list_notices(
        db,
        page=page,
        page_size=page_size,
        status=status,
    )
    pages = (total + page_size - 1) // page_size
    return NoticeListResponse(
        items=items,
        pagination=PageInfo(
            page=page,
            page_size=page_size,
            total=total,
            pages=pages,
        ),
    )


@router.post("", response_model=NoticeResponse, status_code=201)
def create_notice(
    payload: NoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NoticeResponse:
    """Create a new community notice (staff/admin only)."""
    if current_user.role not in ("ADMIN", "PROPERTY_STAFF"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return notice_service.create_notice(db, payload=payload)
