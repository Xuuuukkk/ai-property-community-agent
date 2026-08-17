"""Pydantic schemas for owner-submitted issue reports."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PageInfo


class IssueCreate(BaseModel):
    """Payload for an owner submitting an issue report."""

    category: str = Field(..., description="类型：public_facility / complaint / report")
    zone: str | None = Field(None, description="区域：东区/西区/南区/北区")
    location: str | None = Field(None, description="点位，如 电梯/垃圾投放点/消防通道")
    description: str = Field(..., min_length=1, description="问题描述")
    images: list[str] | None = Field(None, description="照片路径列表")


class IssueReply(BaseModel):
    """Payload for property staff replying to an issue."""

    reply: str = Field(..., min_length=1, description="答复内容")


class IssueResponse(BaseModel):
    """Issue report representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    category: str
    zone: str | None
    location: str | None
    description: str
    images: list | None
    status: str
    reply: str | None
    replied_at: datetime | None
    created_at: datetime


class IssueListResponse(BaseModel):
    """Paginated list of issue reports."""

    items: list[IssueResponse]
    pagination: PageInfo


class IssueOptionsResponse(BaseModel):
    """Preset options for the issue report form."""

    zones: list[str]
    locations: list[str]
    categories: list[dict]
