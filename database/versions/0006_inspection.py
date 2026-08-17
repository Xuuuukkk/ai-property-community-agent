"""Add automated patrol inspection tables.

Tables:
- inspection_camera
- inspection_record
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0006_inspection"
down_revision = "0005_embedding_dim"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "inspection_camera",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("provider_type", sa.String(length=32), nullable=False),
        sa.Column("source_config", postgresql.JSONB(), nullable=True),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "inspection_record",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("camera_id", sa.BigInteger(), nullable=False),
        sa.Column("image_path", sa.String(length=512), nullable=True),
        sa.Column("anomaly_type", sa.String(length=64), nullable=True),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("raw_result", postgresql.JSONB(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["camera_id"], ["inspection_camera.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_inspection_record_camera_id", "inspection_record", ["camera_id"])


def downgrade() -> None:
    op.drop_index("ix_inspection_record_camera_id", table_name="inspection_record")
    op.drop_table("inspection_record")
    op.drop_table("inspection_camera")
