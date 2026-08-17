"""Conversation feedback and knowledge-gap models.

These support the AI assistant's self-improvement loop: owners rate or correct
AI answers; downvotes and corrections surface as "knowledge gaps" that staff
review and approve into the RAG knowledge base.
"""

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

# Feedback rating values.
RATING_UP = "up"
RATING_DOWN = "down"

# Knowledge gap lifecycle.
GAP_PENDING = "pending"
GAP_APPROVED = "approved"
GAP_REJECTED = "rejected"


class MessageFeedback(Base):
    """An owner's rating/correction on an AI answer."""

    __tablename__ = "message_feedback"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True
    )
    conversation_id: Mapped[int | None] = mapped_column(
        ForeignKey("conversation.id", ondelete="SET NULL"), nullable=True
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[str] = mapped_column(String(8), nullable=False, default=RATING_UP)
    correction: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )


class KnowledgeGap(Base):
    """A question the AI couldn't answer well, pending staff review."""

    __tablename__ = "knowledge_gap"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    # Proposed answer, filled by the owner's correction or by staff on review.
    suggested_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(16), nullable=False, default="feedback")
    status: Mapped[str] = mapped_column(String(16), nullable=False, default=GAP_PENDING)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )
    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=False), nullable=True
    )
