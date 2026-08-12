"""Knowledge service: RAG retrieval orchestration."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.embeddings import get_embedding_provider
from app.repositories import knowledge as knowledge_repo


def retrieve_knowledge(
    db: Session,
    query: str,
    *,
    top_k: int = 5,
    category: str | None = None,
) -> dict:
    """Embed the query and retrieve relevant knowledge chunks.

    Args:
        db: SQLAlchemy session.
        query: User question in natural language.
        top_k: Maximum number of chunks to return.
        category: Optional filter on document category (e.g. ``decoration``).

    Returns:
        Dict with ``query``, ``results`` and ``message``.  If no chunks are
        indexed, returns a polite fallback without raising.
    """
    provider = get_embedding_provider()
    query_embedding = provider.embed_query(query)

    results = knowledge_repo.search_similar_chunks(
        db,
        query_embedding=query_embedding,
        top_k=top_k,
        category=category,
    )

    if not results:
        return {
            "query": query,
            "results": [],
            "message": "当前知识库暂无相关规定，建议联系物业服务中心确认。",
        }

    return {
        "query": query,
        "results": results,
        "message": f"找到 {len(results)} 条相关知识。",
    }


def get_index_stats(db: Session) -> dict:
    """Return current knowledge base indexing statistics."""
    return {
        "documents": knowledge_repo.count_indexed_documents(db),
        "chunks": knowledge_repo.count_indexed_chunks(db),
    }
