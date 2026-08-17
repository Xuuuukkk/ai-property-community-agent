"""Pydantic schemas for notifications."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.common import PageInfo


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    title: str
    content: str
    related_type: str | None
    related_id: int | None
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    pagination: PageInfo


class UnreadCountResponse(BaseModel):
    count: int
