"""Add image_urls and confirmation timestamps to repair_order.

Columns:
- image_urls (JSONB): optional photos uploaded by the owner
- owner_confirmed_at (DateTime): when the owner confirms completion
- worker_confirmed_at (DateTime): when the worker confirms completion
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0004_add_repair_order_fields"
down_revision = "0003_agent_traces"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "repair_order",
        sa.Column("image_urls", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        "repair_order",
        sa.Column("owner_confirmed_at", sa.DateTime(timezone=False), nullable=True),
    )
    op.add_column(
        "repair_order",
        sa.Column("worker_confirmed_at", sa.DateTime(timezone=False), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("repair_order", "worker_confirmed_at")
    op.drop_column("repair_order", "owner_confirmed_at")
    op.drop_column("repair_order", "image_urls")
