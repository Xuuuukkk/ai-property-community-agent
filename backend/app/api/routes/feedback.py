"""Conversation feedback and knowledge-gap review API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse,
    FeedbackStatsResponse,
    GapApprove,
    KnowledgeGapListResponse,
    KnowledgeGapResponse,
)
from app.services.feedback import feedback_service

router = APIRouter(tags=["feedback"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.post("/feedback", response_model=FeedbackResponse, status_code=201)
def create_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeedbackResponse:
    """Owner rates/corrects an AI answer; downvotes create a knowledge gap."""
    return feedback_service.create_feedback(db, user_id=current_user.id, payload=payload)


@router.get("/knowledge-gaps", response_model=KnowledgeGapListResponse)
def list_knowledge_gaps(
    gap_status: str | None = Query(None, description="pending / approved / rejected"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> KnowledgeGapListResponse:
    """List knowledge gaps (staff only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    items = feedback_service.list_gaps(db, gap_status=gap_status)
    return KnowledgeGapListResponse(items=items)


@router.post("/knowledge-gaps/{gap_id}/approve", response_model=KnowledgeGapResponse)
def approve_knowledge_gap(
    gap_id: int,
    payload: GapApprove,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> KnowledgeGapResponse:
    """Approve a gap and write the answer into the RAG knowledge base."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    gap = feedback_service.get_gap(db, gap_id)
    return feedback_service.approve_gap(db, gap, payload.answer)


@router.post("/knowledge-gaps/{gap_id}/reject", response_model=KnowledgeGapResponse)
def reject_knowledge_gap(
    gap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> KnowledgeGapResponse:
    """Reject a gap without writing it to the knowledge base."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    gap = feedback_service.get_gap(db, gap_id)
    return feedback_service.reject_gap(db, gap)


@router.get("/feedback/stats", response_model=FeedbackStatsResponse)
def feedback_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FeedbackStatsResponse:
    """Aggregated feedback quality stats (staff only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return feedback_service.feedback_stats(db)
