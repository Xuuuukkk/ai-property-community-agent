"""Add notification table."""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0013_notification"
down_revision = "0012_feedback_knowledge_gap"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notification",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("type", sa.String(length=32), nullable=False),
        sa.Column("title", sa.String(length=128), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("related_type", sa.String(length=32), nullable=True),
        sa.Column("related_id", sa.BigInteger(), nullable=True),
        sa.Column("is_read", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_notification_user_id", "notification", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_notification_user_id", table_name="notification")
    op.drop_table("notification")
