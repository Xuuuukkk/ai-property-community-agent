"""Repository for knowledge base vector search."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.knowledge import KnowledgeChunk, KnowledgeDocument


def search_similar_chunks(
    db: Session,
    query_embedding: list[float],
    *,
    top_k: int = 5,
    category: str | None = None,
) -> list[dict]:
    """Return the most relevant knowledge chunks ordered by cosine similarity.

    Args:
        db: SQLAlchemy session.
        query_embedding: Dense vector for the user query.
        top_k: Maximum number of chunks to return.
        category: Optional metadata filter on ``knowledge_document.category``.

    Returns:
        List of result dicts with keys:
        chunk_id, document_id, title, source_path, category, chunk_index,
        content, similarity.
    """
    # pgvector <=> operator is Euclidean distance; 1 - (<=> / 2) approximates
    # cosine similarity for normalized vectors.  The embeddings produced by
    # sentence-transformers are L2-normalized, so cosine distance (<=>) is
    # equivalent to 1 - cosine_similarity.  We use the standard cosine distance
    # operator and convert to similarity for the API response.
    distance_expr = KnowledgeChunk.embedding.cosine_distance(query_embedding)
    similarity_expr = 1 - distance_expr

    stmt = (
        select(
            KnowledgeChunk.id.label("chunk_id"),
            KnowledgeDocument.id.label("document_id"),
            KnowledgeDocument.title,
            KnowledgeDocument.source_path,
            KnowledgeDocument.category,
            KnowledgeChunk.chunk_index,
            KnowledgeChunk.content,
            similarity_expr.label("similarity"),
        )
        .join(KnowledgeDocument, KnowledgeChunk.document_id == KnowledgeDocument.id)
        .order_by(distance_expr.asc())
        .limit(top_k)
    )

    if category:
        stmt = stmt.where(KnowledgeDocument.category == category)

    rows = db.execute(stmt).mappings().all()
    return [dict(row) for row in rows]


def count_indexed_documents(db: Session) -> int:
    """Return the number of documents currently indexed."""
    return db.query(func.count(KnowledgeDocument.id)).scalar() or 0


def count_indexed_chunks(db: Session) -> int:
    """Return the number of chunks currently indexed."""
    return db.query(func.count(KnowledgeChunk.id)).scalar() or 0
