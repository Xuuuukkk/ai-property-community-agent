"""Pydantic schemas for the User resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    """Public user representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    real_name: str | None = None
    phone: str | None = None
    role: str
    worker_id: int | None = None
    created_at: datetime


class UserListResponse(BaseModel):
    """Paginated list of users."""

    model_config = ConfigDict(from_attributes=True)

    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    pages: int
