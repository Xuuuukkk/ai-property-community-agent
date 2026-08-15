"""Increase knowledge_chunk.embedding dimension to match the provider.

The default dimension is raised from 384 to 1024 to support Zhipu
embedding-3.  pgvector does not allow ALTER COLUMN on vector dimensions,
so the column is dropped and recreated.  Existing knowledge documents and
chunks are truncated; they must be re-ingested from knowledge-base/ after
this migration.
"""

from alembic import op
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = "0005_embedding_dim"
down_revision = "0004_add_repair_order_fields"
branch_labels = None
depends_on = None


TARGET_DIMENSION = 1024


def upgrade() -> None:
    # Truncate existing chunks/documents because embeddings are invalid after
    # a dimension change.  Re-ingest knowledge-base/ after migrating.
    op.execute(text("TRUNCATE TABLE knowledge_chunk CASCADE"))
    op.execute(text("TRUNCATE TABLE knowledge_document CASCADE"))

    # Drop the HNSW index before dropping the column.
    op.drop_index(
        "ix_knowledge_chunk_embedding_hnsw",
        table_name="knowledge_chunk",
        if_exists=True,
    )

    # Drop and recreate the embedding column with the new dimension.
    op.execute(text("ALTER TABLE knowledge_chunk DROP COLUMN embedding"))
    op.execute(
        text(
            f"ALTER TABLE knowledge_chunk ADD COLUMN embedding vector({TARGET_DIMENSION}) NOT NULL"
        )
    )

    # Recreate the HNSW index for cosine similarity search.
    op.execute(
        text(
            "CREATE INDEX ix_knowledge_chunk_embedding_hnsw "
            "ON knowledge_chunk USING hnsw (embedding vector_cosine_ops) "
            "WITH (m = 16, ef_construction = 64)"
        )
    )


def downgrade() -> None:
    # Reverse the operation: go back to 384-d vectors.
    op.execute(text("TRUNCATE TABLE knowledge_chunk CASCADE"))
    op.execute(text("TRUNCATE TABLE knowledge_document CASCADE"))

    op.drop_index(
        "ix_knowledge_chunk_embedding_hnsw",
        table_name="knowledge_chunk",
        if_exists=True,
    )

    op.execute(text("ALTER TABLE knowledge_chunk DROP COLUMN embedding"))
    op.execute(
        text("ALTER TABLE knowledge_chunk ADD COLUMN embedding vector(384) NOT NULL")
    )

    op.execute(
        text(
            "CREATE INDEX ix_knowledge_chunk_embedding_hnsw "
            "ON knowledge_chunk USING hnsw (embedding vector_cosine_ops) "
            "WITH (m = 16, ef_construction = 64)"
        )
    )
