from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import WorkerDepartment, WorkerStatus


class Worker(Base):
    """Worker / 物业员工信息."""

    __tablename__ = "worker"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    department: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=WorkerDepartment.ENGINEERING.value,
    )
    position: Mapped[str | None] = mapped_column(String(64), nullable=True)
    skill_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=WorkerStatus.ON_DUTY.value,
    )
    hire_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    user: Mapped["User"] = relationship(back_populates="worker_profile")
