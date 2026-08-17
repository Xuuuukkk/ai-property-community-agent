"""Notification API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.notification import (
    NotificationListResponse,
    NotificationResponse,
    UnreadCountResponse,
)
from app.services.notification import (
    list_notifications,
    mark_all_read,
    mark_read,
    unread_count,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=NotificationListResponse)
def get_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationListResponse:
    """List the current user's notifications (newest first)."""
    items, total = list_notifications(
        db, user_id=current_user.id, page=page, page_size=page_size
    )
    pages = (total + page_size - 1) // page_size
    return NotificationListResponse(
        items=items,
        pagination=PageInfo(page=page, page_size=page_size, total=total, pages=pages),
    )


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UnreadCountResponse:
    """Return the current user's unread notification count."""
    return UnreadCountResponse(count=unread_count(db, user_id=current_user.id))


@router.post("/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    """Mark a single notification as read."""
    return mark_read(db, notification_id=notification_id, user_id=current_user.id)


@router.post("/read-all", response_model=UnreadCountResponse)
def read_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UnreadCountResponse:
    """Mark all of the current user's notifications as read."""
    mark_all_read(db, user_id=current_user.id)
    return UnreadCountResponse(count=0)
