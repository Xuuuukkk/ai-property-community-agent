from datetime import datetime

from sqlalchemy import String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Community(Base):
    """Community / 小区基础信息."""

    __tablename__ = "community"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(128), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    built_year: Mapped[int | None] = mapped_column(nullable=True)
    building_count: Mapped[int | None] = mapped_column(nullable=True)
    total_households: Mapped[int | None] = mapped_column(nullable=True)
    parking_spaces: Mapped[int | None] = mapped_column(nullable=True)
    property_company: Mapped[str | None] = mapped_column(String(128), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
    )

    buildings: Mapped[list["Building"]] = relationship(
        back_populates="community",
        lazy="selectin",
    )
