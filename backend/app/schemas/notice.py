"""Pydantic schemas for the Notice resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PageInfo


class NoticeCreate(BaseModel):
    """Payload for creating a new community notice."""

    title: str = Field(..., min_length=1, max_length=255, description="Notice title")
    content: str | None = Field(None, description="Notice body")
    publisher_id: int = Field(..., description="ID of the publishing worker")
    notice_type: str = Field(default="facility_notice", description="Notice category (e.g. water_power_outage, elevator_maintenance, fire_inspection, community_activity, public_revenue, committee_notice, weather_alert, facility_notice)")
    is_pinned: bool = Field(default=False, description="Whether to pin the notice")


class NoticeResponse(BaseModel):
    """Public notice representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str | None
    publisher_id: int
    notice_type: str
    is_pinned: bool
    status: str
    created_at: datetime


class NoticeListResponse(BaseModel):
    """Paginated list of notices."""

    items: list[NoticeResponse]
    pagination: PageInfo
