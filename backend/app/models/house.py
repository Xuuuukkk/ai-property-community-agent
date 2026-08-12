from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import HouseStatus


class House(Base):
    """House / 房屋信息."""

    __tablename__ = "house"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    building_id: Mapped[int] = mapped_column(
        ForeignKey("building.id", ondelete="CASCADE"),
        nullable=False,
    )
    room_no: Mapped[str] = mapped_column(String(32), nullable=False)
    unit_no: Mapped[int | None] = mapped_column(nullable=True)
    floor_no: Mapped[int | None] = mapped_column(nullable=True)
    area: Mapped[Decimal | None] = mapped_column(Numeric(8, 2), nullable=True)
    house_type: Mapped[str | None] = mapped_column(String(16), nullable=True)
    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default=HouseStatus.VACANT.value,
    )

    building: Mapped["Building"] = relationship(back_populates="houses")
    bindings: Mapped[list["HouseBinding"]] = relationship(
        back_populates="house",
        lazy="selectin",
    )
