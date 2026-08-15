"""Knowledge base management and RAG debug endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.paths import KNOWLEDGE_BASE_DIR as KNOWLEDGE_DIR, REPO_ROOT
from app.core.security import get_current_user
from app.models.user import User
from app.services import knowledge as knowledge_service
from app.services.knowledge_indexer import index_documents

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


class KnowledgeSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User question")
    top_k: int = Field(default=5, ge=1, le=20)
    category: str | None = Field(default=None, description="Filter by document category")


class KnowledgeSearchResponse(BaseModel):
    query: str
    results: list[dict]
    message: str


class ReindexResponse(BaseModel):
    documents: int
    chunks: int


@router.post("/search", response_model=KnowledgeSearchResponse)
def search_knowledge(
    request: KnowledgeSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Semantic search over the indexed knowledge base."""
    return knowledge_service.retrieve_knowledge(
        db,
        query=request.query,
        top_k=request.top_k,
        category=request.category,
    )


@router.post("/reindex", response_model=ReindexResponse)
def reindex_knowledge(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Rebuild the knowledge base index from ``knowledge-base/*.md`` (admin only).

    In production this should also be run as a background job.  For the MVP it
    is exposed as a simple management endpoint restricted to admins.
    """
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    settings = get_settings()
    knowledge_dir = KNOWLEDGE_DIR

    if not knowledge_dir.is_dir():
        raise HTTPException(status_code=500, detail="Knowledge base directory not found")

    stats = index_documents(db, knowledge_dir, repo_root=REPO_ROOT)
    return stats


@router.get("/stats")
def knowledge_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Return current knowledge base indexing statistics."""
    return knowledge_service.get_index_stats(db)
