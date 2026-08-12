from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import RepairStatus, RepairType, RepairUrgency


class RepairOrder(Base):
    """RepairOrder / 维修工单."""

    __tablename__ = "repair_order"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_no: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    house_id: Mapped[int | None] = mapped_column(
        ForeignKey("house.id", ondelete="SET NULL"),
        nullable=True,
    )
    worker_id: Mapped[int | None] = mapped_column(
        ForeignKey("worker.id", ondelete="SET NULL"),
        nullable=True,
    )
    type: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=RepairType.WATER_LEAK.value,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    urgency: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default=RepairUrgency.MEDIUM.value,
    )
    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default=RepairStatus.CREATED.value,
    )
    cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        server_default=func.now(),
        nullable=False,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=False),
        nullable=True,
    )

    records: Mapped[list["RepairRecord"]] = relationship(
        back_populates="repair",
        lazy="selectin",
    )
