"""Knowledge tools exposed to the Knowledge Agent.

These tools now perform real semantic retrieval against the pgvector-backed
knowledge base.  They follow the same Agent → Tool → Service → Repository
layering as the business tools.
"""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.services import knowledge as knowledge_service


def search_knowledge(db: Session, query: str, *, top_k: int = 5) -> dict:
    """Search the knowledge base for documents matching the query."""
    return knowledge_service.retrieve_knowledge(db, query=query, top_k=top_k)


def search_knowledge_by_category(
    db: Session, query: str, category: str, *, top_k: int = 5
) -> dict:
    """Search within a specific knowledge category (e.g. decoration, parking)."""
    return knowledge_service.retrieve_knowledge(
        db, query=query, top_k=top_k, category=category
    )


def retrieve_document(document_id: str) -> dict:
    """Retrieve a specific knowledge document by ID.

    Placeholder: documents are returned as chunks by ``search_knowledge``.
    A full document fetch can be added here when the agent needs it.
    """
    return {
        "document_id": document_id,
        "content": None,
        "message": "请使用 search_knowledge 按问题检索相关片段。",
    }
