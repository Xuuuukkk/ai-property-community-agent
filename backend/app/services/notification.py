"""Notification service: create and query in-app notifications."""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.notification import Notification


def notify(
    db: Session,
    *,
    user_id: int,
    type: str,
    title: str,
    content: str,
    related_type: str | None = None,
    related_id: int | None = None,
) -> Notification:
    """Create a notification for a single user."""
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        content=content,
        related_type=related_type,
        related_id=related_id,
    )
    db.add(notification)
    return notification


def notify_many(
    db: Session,
    *,
    user_ids: list[int],
    type: str,
    title: str,
    content: str,
    related_type: str | None = None,
    related_id: int | None = None,
) -> None:
    """Create the same notification for multiple users."""
    for user_id in user_ids:
        notify(
            db,
            user_id=user_id,
            type=type,
            title=title,
            content=content,
            related_type=related_type,
            related_id=related_id,
        )


def list_notifications(
    db: Session, *, user_id: int, page: int = 1, page_size: int = 20
) -> tuple[list[Notification], int]:
    query = db.query(Notification).filter(Notification.user_id == user_id)
    total = query.with_entities(Notification.id).count()
    items = (
        query.order_by(Notification.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return items, total


def unread_count(db: Session, *, user_id: int) -> int:
    return (
        db.query(func.count(Notification.id))
        .filter(Notification.user_id == user_id)
        .filter(Notification.is_read.is_(False))
        .scalar()
        or 0
    )


def mark_read(db: Session, *, notification_id: int, user_id: int) -> Notification:
    notification = db.get(Notification, notification_id)
    if not notification or notification.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def mark_all_read(db: Session, *, user_id: int) -> int:
    count = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .filter(Notification.is_read.is_(False))
        .update({"is_read": True}, synchronize_session=False)
    )
    db.commit()
    return count
