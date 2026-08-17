"""Add bbox column to inspection_record for anomaly region marking."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0007_inspection_bbox"
down_revision = "0006_inspection"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "inspection_record",
        sa.Column("bbox", postgresql.JSONB(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("inspection_record", "bbox")
