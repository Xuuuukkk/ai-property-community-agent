"""Add issue_report table for owner-submitted community issues."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0009_issue_report"
down_revision = "0008_inspection_camera_zone"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "issue_report",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("category", sa.String(length=32), nullable=False),
        sa.Column("zone", sa.String(length=32), nullable=True),
        sa.Column("location", sa.String(length=64), nullable=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("images", postgresql.JSONB(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("reply", sa.Text(), nullable=True),
        sa.Column("replied_at", sa.DateTime(timezone=False), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_issue_report_user_id", "issue_report", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_issue_report_user_id", table_name="issue_report")
    op.drop_table("issue_report")
