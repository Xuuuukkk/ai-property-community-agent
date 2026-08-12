"""Initial migration: create 10 core business tables.

Tables:
- community
- building
- house
- "user"
- house_binding
- worker
- repair_order
- repair_record
- fee_bill
- notice

AI-related tables (conversation, message, agent_trace) and pgvector knowledge tables
are intentionally excluded from this first migration and will be added in Phase 5/6.
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- community ---
    op.create_table(
        "community",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("name_en", sa.String(length=128), nullable=True),
        sa.Column("address", sa.String(length=255), nullable=True),
        sa.Column("built_year", sa.Integer(), nullable=True),
        sa.Column("building_count", sa.Integer(), nullable=True),
        sa.Column("total_households", sa.Integer(), nullable=True),
        sa.Column("parking_spaces", sa.Integer(), nullable=True),
        sa.Column("property_company", sa.String(length=128), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- building ---
    op.create_table(
        "building",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("community_id", sa.BigInteger(), nullable=False),
        sa.Column("building_no", sa.String(length=16), nullable=False),
        sa.Column("floors", sa.Integer(), nullable=True),
        sa.Column("unit_count", sa.Integer(), nullable=True),
        sa.Column("elevator_config", sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(["community_id"], ["community.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- house ---
    op.create_table(
        "house",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("building_id", sa.BigInteger(), nullable=False),
        sa.Column("room_no", sa.String(length=32), nullable=False),
        sa.Column("unit_no", sa.Integer(), nullable=True),
        sa.Column("floor_no", sa.Integer(), nullable=True),
        sa.Column("area", sa.Numeric(precision=8, scale=2), nullable=True),
        sa.Column("house_type", sa.String(length=16), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="VACANT"),
        sa.ForeignKeyConstraint(["building_id"], ["building.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- user (quoted because it is a PostgreSQL reserved word) ---
    op.create_table(
        "user",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("username", sa.String(length=64), nullable=False),
        sa.Column("real_name", sa.String(length=64), nullable=True),
        sa.Column("phone", sa.String(length=32), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("role", sa.String(length=32), nullable=False, server_default="OWNER"),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username"),
    )

    # --- house_binding ---
    op.create_table(
        "house_binding",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("house_id", sa.BigInteger(), nullable=False),
        sa.Column("relation", sa.String(length=32), nullable=False, server_default="owner"),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["house_id"], ["house.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- worker ---
    op.create_table(
        "worker",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("department", sa.String(length=32), nullable=False, server_default="engineering"),
        sa.Column("position", sa.String(length=64), nullable=True),
        sa.Column("skill_type", sa.String(length=64), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="ON_DUTY"),
        sa.Column("hire_date", sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    # --- repair_order ---
    op.create_table(
        "repair_order",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("order_no", sa.String(length=32), nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("house_id", sa.BigInteger(), nullable=True),
        sa.Column("worker_id", sa.BigInteger(), nullable=True),
        sa.Column("type", sa.String(length=32), nullable=False, server_default="water_leak"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("urgency", sa.String(length=16), nullable=False, server_default="MEDIUM"),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="CREATED"),
        sa.Column("cost", sa.Numeric(precision=10, scale=2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=False), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["house_id"], ["house.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["worker_id"], ["worker.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("order_no"),
    )

    # --- repair_record ---
    op.create_table(
        "repair_record",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("repair_id", sa.BigInteger(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(length=512), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["repair_id"], ["repair_order.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- fee_bill ---
    op.create_table(
        "fee_bill",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("house_id", sa.BigInteger(), nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("bill_type", sa.String(length=32), nullable=False, server_default="property_fee"),
        sa.Column("period", sa.String(length=16), nullable=True),
        sa.Column("amount", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="UNPAID"),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=False), nullable=True),
        sa.ForeignKeyConstraint(["house_id"], ["house.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- notice ---
    op.create_table(
        "notice",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("publisher_id", sa.BigInteger(), nullable=False),
        sa.Column("notice_type", sa.String(length=32), nullable=False, server_default="facility_notice"),
        sa.Column("is_pinned", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="PUBLISHED"),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["publisher_id"], ["worker.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- indexes (from database-design.md §7) ---
    op.create_index("ix_user_phone", "user", ["phone"], unique=False)
    op.create_index("ix_repair_order_user_id", "repair_order", ["user_id"], unique=False)
    op.create_index("ix_repair_order_status", "repair_order", ["status"], unique=False)
    op.create_index("ix_repair_order_created_at", "repair_order", ["created_at"], unique=False)
    op.create_index("ix_fee_bill_house_id", "fee_bill", ["house_id"], unique=False)
    op.create_index("ix_fee_bill_status", "fee_bill", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_fee_bill_status", table_name="fee_bill")
    op.drop_index("ix_fee_bill_house_id", table_name="fee_bill")
    op.drop_index("ix_repair_order_created_at", table_name="repair_order")
    op.drop_index("ix_repair_order_status", table_name="repair_order")
    op.drop_index("ix_repair_order_user_id", table_name="repair_order")
    op.drop_index("ix_user_phone", table_name="user")

    op.drop_table("notice")
    op.drop_table("fee_bill")
    op.drop_table("repair_record")
    op.drop_table("repair_order")
    op.drop_table("worker")
    op.drop_table("house_binding")
    op.drop_table("user")
    op.drop_table("house")
    op.drop_table("building")
    op.drop_table("community")
