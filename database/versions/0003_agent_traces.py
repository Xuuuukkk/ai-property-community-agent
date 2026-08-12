"""Add agent observability tables for evaluation.

Tables:
- conversation
- message
- agent_trace
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0003_agent_traces"
down_revision = "0002_knowledge"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- conversation ---
    op.create_table(
        "conversation",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=True),
        sa.Column("session_id", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("session_id"),
    )
    op.create_index("ix_conversation_session_id", "conversation", ["session_id"])
    op.create_index("ix_conversation_user_id", "conversation", ["user_id"])

    # --- message ---
    op.create_table(
        "message",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("conversation_id", sa.BigInteger(), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("agent_name", sa.String(length=64), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversation.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_message_conversation_id", "message", ["conversation_id"])

    # --- agent_trace ---
    op.create_table(
        "agent_trace",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("session_id", sa.String(length=64), nullable=False),
        sa.Column("conversation_id", sa.BigInteger(), nullable=True),
        sa.Column("agent", sa.String(length=64), nullable=False),
        sa.Column("tool", sa.String(length=128), nullable=False),
        sa.Column("input", postgresql.JSONB(), nullable=True),
        sa.Column("output", postgresql.JSONB(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=False), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversation.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_agent_trace_session_id", "agent_trace", ["session_id"])
    op.create_index("ix_agent_trace_conversation_id", "agent_trace", ["conversation_id"])


def downgrade() -> None:
    op.drop_index("ix_agent_trace_conversation_id", table_name="agent_trace")
    op.drop_index("ix_agent_trace_session_id", table_name="agent_trace")
    op.drop_table("agent_trace")
    op.drop_index("ix_message_conversation_id", table_name="message")
    op.drop_table("message")
    op.drop_index("ix_conversation_user_id", table_name="conversation")
    op.drop_index("ix_conversation_session_id", table_name="conversation")
    op.drop_table("conversation")
