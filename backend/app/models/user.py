from datetime import datetime

from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import UserRole


class User(Base):
    """User / 系统用户.

    Note: ``user`` is a PostgreSQL reserved word, so the table name is quoted.
    """

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    real_name: Mapped[str | None] = mapped_column(String(64), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    role: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=UserRole.OWNER.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
    )

    bindings: Mapped[list["HouseBinding"]] = relationship(
        back_populates="user",
        lazy="selectin",
    )
    worker_profile: Mapped["Worker | None"] = relationship(
        back_populates="user",
        lazy="selectin",
    )
