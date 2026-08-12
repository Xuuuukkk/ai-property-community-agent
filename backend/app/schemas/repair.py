"""Pydantic schemas for the RepairOrder resource."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PageInfo


class RepairCreate(BaseModel):
    """Payload for creating a new repair order."""

    user_id: int = Field(..., description="ID of the user reporting the issue")
    house_id: int | None = Field(None, description="Optional linked house ID")
    type: str = Field(default="water_leak", description="Repair category (e.g. water_leak, elevator_fault, access_control, power_trip, wall_seepage, public_facility)")
    description: str | None = Field(None, description="Detailed problem description")
    urgency: str = Field(default="MEDIUM", description="Urgency level (e.g. LOW, MEDIUM, HIGH, URGENT)")


class RepairResponse(BaseModel):
    """Public repair order representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    order_no: str
    user_id: int
    house_id: int | None
    worker_id: int | None
    type: str
    description: str | None
    urgency: str
    status: str
    cost: Decimal
    created_at: datetime
    completed_at: datetime | None


class RepairListResponse(BaseModel):
    """Paginated list of repair orders."""

    items: list[RepairResponse]
    pagination: PageInfo
