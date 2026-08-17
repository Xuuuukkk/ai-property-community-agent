"""Feedback and knowledge-gap business logic (AI self-improvement loop)."""

from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.embeddings import get_embedding_provider
from app.models.feedback import (
    GAP_APPROVED,
    GAP_PENDING,
    GAP_REJECTED,
    RATING_DOWN,
    KnowledgeGap,
    MessageFeedback,
)
from app.models.knowledge import KnowledgeChunk, KnowledgeDocument


class FeedbackService:
    """Business logic for conversation feedback and knowledge-gap review."""

    def create_feedback(
        self, db: Session, *, user_id: int, payload
    ) -> MessageFeedback:
        feedback = MessageFeedback(
            user_id=user_id,
            conversation_id=payload.conversation_id,
            question=payload.question,
            answer=payload.answer,
            rating=payload.rating,
            correction=payload.correction,
        )
        db.add(feedback)
        db.flush()

        # A downvote or a correction signals a knowledge gap to review.
        if payload.rating == RATING_DOWN or payload.correction:
            db.add(
                KnowledgeGap(
                    question=payload.question,
                    suggested_answer=payload.correction,
                    source="feedback",
                    status=GAP_PENDING,
                )
            )

        db.commit()
        db.refresh(feedback)
        return feedback

    def list_gaps(
        self, db: Session, *, gap_status: str | None = None
    ) -> list[KnowledgeGap]:
        query = db.query(KnowledgeGap)
        if gap_status:
            query = query.filter(KnowledgeGap.status == gap_status)
        return query.order_by(KnowledgeGap.id.desc()).all()

    def get_gap(self, db: Session, gap_id: int) -> KnowledgeGap:
        gap = db.get(KnowledgeGap, gap_id)
        if not gap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Knowledge gap id={gap_id} not found",
            )
        return gap

    def approve_gap(self, db: Session, gap: KnowledgeGap, answer: str | None) -> KnowledgeGap:
        final_answer = (answer or gap.suggested_answer or "").strip()
        if not final_answer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="审核通过需要提供答案",
            )

        self._write_to_knowledge_base(db, gap.question, final_answer)
        gap.suggested_answer = final_answer
        gap.status = GAP_APPROVED
        gap.resolved_at = datetime.now()
        db.commit()
        db.refresh(gap)
        return gap

    def reject_gap(self, db: Session, gap: KnowledgeGap) -> KnowledgeGap:
        gap.status = GAP_REJECTED
        gap.resolved_at = datetime.now()
        db.commit()
        db.refresh(gap)
        return gap

    @staticmethod
    def _write_to_knowledge_base(db: Session, question: str, answer: str) -> None:
        """Incrementally add a learned Q&A into the RAG knowledge base."""
        provider = get_embedding_provider()
        content = f"问：{question}\n答：{answer}"

        source_path = f"ai-learned/{datetime.now().strftime('%Y%m%d%H%M%S')}-{abs(hash(question)) % 100000}.md"
        document = KnowledgeDocument(
            title=f"AI学习：{question[:40]}",
            source_path=source_path,
            category="AI学习",
        )
        db.add(document)
        db.flush()

        embedding = provider.embed_documents([content])[0]
        db.add(
            KnowledgeChunk(
                document_id=document.id,
                chunk_index=0,
                content=content,
                embedding=embedding,
            )
        )
        db.flush()

    def feedback_stats(self, db: Session) -> dict:
        total = db.query(func.count(MessageFeedback.id)).scalar() or 0
        up = (
            db.query(func.count(MessageFeedback.id))
            .filter(MessageFeedback.rating == "up")
            .scalar()
            or 0
        )
        down = total - up

        # Most-downvoted questions (for prompt optimization).
        rows = (
            db.query(MessageFeedback.question, func.count(MessageFeedback.id))
            .filter(MessageFeedback.rating == RATING_DOWN)
            .group_by(MessageFeedback.question)
            .order_by(func.count(MessageFeedback.id).desc())
            .limit(10)
            .all()
        )
        top_problems = [{"question": q, "count": c} for q, c in rows]

        return {
            "total": total,
            "up": up,
            "down": down,
            "down_rate": round(down / total, 4) if total else 0.0,
            "top_problems": top_problems,
        }


feedback_service = FeedbackService()
