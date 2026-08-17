"""Pydantic schemas for the automated patrol inspection feature."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import PageInfo


class CameraCreate(BaseModel):
    """Payload for creating a monitored point."""

    name: str = Field(..., min_length=1, max_length=128, description="监控点名称")
    zone: str | None = Field(None, description="所属区域，如 东区/西区/南区/北区")
    location: str | None = Field(None, description="具体点位，如 B1栋东侧分类垃圾房")
    manager: str | None = Field(None, description="负责人")
    provider_type: str = Field(default="local_dir", description="截图源类型：local_dir / rtsp")
    source_config: dict | None = Field(None, description="截图源配置，如 {directory: ...} 或 {rtsp_url: ...}")
    enabled: bool = Field(default=True, description="是否启用")


class CameraResponse(BaseModel):
    """Monitored point representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    zone: str | None
    location: str | None
    manager: str | None
    provider_type: str
    source_config: dict | None
    enabled: bool
    created_at: datetime


class CameraListResponse(BaseModel):
    """List of monitored points."""

    items: list[CameraResponse]


class InspectionRecordResponse(BaseModel):
    """Single inspection record representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    camera_id: int
    image_path: str | None
    anomaly_type: str | None
    confidence: float | None
    summary: str | None
    bbox: list | None
    status: str
    error: str | None
    created_at: datetime


class InspectionRecordListResponse(BaseModel):
    """Paginated list of inspection records."""

    items: list[InspectionRecordResponse]
    pagination: PageInfo


class RunInspectionResponse(BaseModel):
    """Result of a single inspection run."""

    record: InspectionRecordResponse
