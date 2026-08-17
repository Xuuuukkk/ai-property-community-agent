"""Inspection models for the automated patrol feature.

Two tables:
- ``InspectionCamera``: a monitored location (a camera or an image source) to
  be inspected on a schedule.
- ``InspectionRecord``: the result of one inspection run (the captured image,
  the AI analysis, and any detected anomaly).
"""

from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InspectionCamera(Base):
    """A monitored point (camera / image source) to inspect."""

    __tablename__ = "inspection_camera"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    # Capture source type, e.g. "local_dir" (read images from a directory) or
    # "rtsp" (pull a frame from an RTSP stream). New types are added by
    # implementing a matching provider in services/camera_providers.py.
    provider_type: Mapped[str] = mapped_column(String(32), nullable=False, default="local_dir")
    # Provider-specific configuration, e.g. {"directory": "/data/inspect"} for
    # local_dir, or {"rtsp_url": "rtsp://..."} for rtsp.
    source_config: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    records: Mapped[list["InspectionRecord"]] = relationship(
        "InspectionRecord", back_populates="camera", cascade="all, delete-orphan"
    )


class InspectionRecord(Base):
    """The result of a single inspection run for a camera."""

    __tablename__ = "inspection_record"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    camera_id: Mapped[int] = mapped_column(
        ForeignKey("inspection_camera.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Path (relative to the app, or an object-store key) of the captured image.
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    # Detected anomaly type, e.g. "垃圾堆积", "车辆违停", "烟雾", or None/"" if
    # the scene is normal.
    anomaly_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    # Confidence of the AI analysis, 0.0 to 1.0.
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    # Human-readable summary produced by the vision model.
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Full structured result returned by the vision model (for debugging).
    raw_result: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # "success" or "error".
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="success")
    # Error message when status == "error".
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    camera: Mapped["InspectionCamera"] = relationship("InspectionCamera", back_populates="records")
