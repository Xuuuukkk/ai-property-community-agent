from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HouseBinding(Base):
    """HouseBinding / 用户-房屋绑定关系."""

    __tablename__ = "house_binding"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    house_id: Mapped[int] = mapped_column(
        ForeignKey("house.id", ondelete="CASCADE"),
        nullable=False,
    )
    relation: Mapped[str] = mapped_column(String(32), nullable=False, default="owner")

    user: Mapped["User"] = relationship(back_populates="bindings")
    house: Mapped["House"] = relationship(back_populates="bindings")
