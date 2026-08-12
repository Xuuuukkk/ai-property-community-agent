from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Building(Base):
    """Building / 楼栋信息."""

    __tablename__ = "building"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    community_id: Mapped[int] = mapped_column(
        ForeignKey("community.id", ondelete="CASCADE"),
        nullable=False,
    )
    building_no: Mapped[str] = mapped_column(String(16), nullable=False)
    floors: Mapped[int | None] = mapped_column(nullable=True)
    unit_count: Mapped[int | None] = mapped_column(nullable=True)
    elevator_config: Mapped[str | None] = mapped_column(String(64), nullable=True)

    community: Mapped["Community"] = relationship(back_populates="buildings")
    houses: Mapped[list["House"]] = relationship(
        back_populates="building",
        lazy="selectin",
    )
