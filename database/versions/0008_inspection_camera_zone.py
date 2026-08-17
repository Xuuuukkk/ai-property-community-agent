"""Add zone/location/manager columns to inspection_camera."""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0008_inspection_camera_zone"
down_revision = "0007_inspection_bbox"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("inspection_camera", sa.Column("zone", sa.String(length=32), nullable=True))
    op.add_column("inspection_camera", sa.Column("location", sa.String(length=128), nullable=True))
    op.add_column("inspection_camera", sa.Column("manager", sa.String(length=64), nullable=True))


def downgrade() -> None:
    op.drop_column("inspection_camera", "manager")
    op.drop_column("inspection_camera", "location")
    op.drop_column("inspection_camera", "zone")
