"""Add knowledge base tables for RAG.

Tables:
- knowledge_document
- knowledge_chunk (with pgvector embedding column)

Also installs the pgvector extension in the target database.
"""

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0002_knowledge"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # pgvector extension must exist before using the vector type.
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # --- knowledge_document ---
    op.create_table(
        "knowledge_document",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("source_path", sa.String(length=512), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=True),
        sa.Column("doc_metadata", postgresql.JSONB(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("source_path"),
    )

    # --- knowledge_chunk ---
    op.create_table(
        "knowledge_chunk",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("document_id", sa.BigInteger(), nullable=False),
        sa.Column("chunk_index", sa.BigInteger(), nullable=False, default=0),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(384), nullable=False),
        sa.Column("chunk_metadata", postgresql.JSONB(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["document_id"], ["knowledge_document.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_knowledge_chunk_document_id", "knowledge_chunk", ["document_id"])

    # Approximate nearest-neighbor index for cosine similarity search.
    op.execute(
        "CREATE INDEX ix_knowledge_chunk_embedding_hnsw "
        "ON knowledge_chunk USING hnsw (embedding vector_cosine_ops) "
        "WITH (m = 16, ef_construction = 64)"
    )


def downgrade() -> None:
    op.drop_index("ix_knowledge_chunk_embedding_hnsw", table_name="knowledge_chunk")
    op.drop_index("ix_knowledge_chunk_document_id", table_name="knowledge_chunk")
    op.drop_table("knowledge_chunk")
    op.drop_table("knowledge_document")
