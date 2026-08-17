"""Add assignee_id/assigned_at to issue_report for auto-dispatch."""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0010_issue_assignee"
down_revision = "0009_issue_report"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("issue_report", sa.Column("assignee_id", sa.BigInteger(), nullable=True))
    op.add_column("issue_report", sa.Column("assigned_at", sa.DateTime(timezone=False), nullable=True))
    op.create_foreign_key(
        "fk_issue_report_assignee_id", "issue_report", "user", ["assignee_id"], ["id"], ondelete="SET NULL"
    )
    op.create_index("ix_issue_report_assignee_id", "issue_report", ["assignee_id"])


def downgrade() -> None:
    op.drop_index("ix_issue_report_assignee_id", table_name="issue_report")
    op.drop_constraint("fk_issue_report_assignee_id", "issue_report", type_="foreignkey")
    op.drop_column("issue_report", "assigned_at")
    op.drop_column("issue_report", "assignee_id")
