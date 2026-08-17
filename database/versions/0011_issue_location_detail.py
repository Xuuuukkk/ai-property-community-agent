"""Add location_detail column to issue_report."""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0011_issue_location_detail"
down_revision = "0010_issue_assignee"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("issue_report", sa.Column("location_detail", sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column("issue_report", "location_detail")
