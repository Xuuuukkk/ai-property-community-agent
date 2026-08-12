"""Pydantic schemas for the FeeBill resource."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PageInfo


class FeeBillResponse(BaseModel):
    """Public fee bill representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    house_id: int
    user_id: int
    bill_type: str = Field(default="property_fee")
    period: str | None = None
    amount: Decimal
    status: str = Field(default="UNPAID")
    due_date: date | None = None
    paid_at: datetime | None = None


class FeeListResponse(BaseModel):
    """Paginated list of fee bills."""

    items: list[FeeBillResponse]
    pagination: PageInfo
