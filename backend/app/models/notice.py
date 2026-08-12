from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.core.enums import NoticeStatus, NoticeType


class Notice(Base):
    """Notice / 物业公告."""

    __tablename__ = "notice"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    publisher_id: Mapped[int] = mapped_column(
        ForeignKey("worker.id", ondelete="CASCADE"),
        nullable=False,
    )
    notice_type: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=NoticeType.FACILITY_NOTICE.value,
    )
    is_pinned: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default=NoticeStatus.PUBLISHED.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        server_default=func.now(),
        nullable=False,
    )
