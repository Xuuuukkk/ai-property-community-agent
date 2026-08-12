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
    created_at: datetime
