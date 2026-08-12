"""Persistence layer for agent observability.

Records conversations, messages, and tool execution traces to PostgreSQL for
debugging and evaluation. Trace persistence is best-effort: failures are logged
but never block the main agent response.
"""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy.orm import Session

from app.models.conversation import AgentTrace, Conversation, Message

logger = logging.getLogger(__name__)


def record_turn(
    db: Session,
    *,
    session_id: str,
    user_id: int | None,
    user_message: str,
    assistant_message: str,
    intent: str | None,
    tool_results: list[dict[str, Any]],
) -> None:
    """Persist one agent turn: conversation + messages + tool traces.

    If a conversation with ``session_id`` already exists, messages and traces
    are appended to it.
    """
    try:
        conversation = db.query(Conversation).filter_by(session_id=session_id).first()
        if conversation is None:
            conversation = Conversation(session_id=session_id, user_id=user_id)
            db.add(conversation)
            db.flush()  # get conversation.id

        db.add(
            Message(
                conversation_id=conversation.id,
                role="USER",
                content=user_message,
            )
        )
        db.add(
            Message(
                conversation_id=conversation.id,
                role="ASSISTANT",
                content=assistant_message,
                agent_name=intent or "unknown",
            )
        )

        for item in tool_results:
            tool_name = item.get("tool") or item.get("tool_name") or "unknown"
            db.add(
                AgentTrace(
                    session_id=session_id,
                    conversation_id=conversation.id,
                    agent=intent or "unknown",
                    tool=tool_name,
                    input=item.get("input"),
                    output=item.get("output") or item,
                )
            )

        db.commit()
    except Exception:
        logger.exception("Failed to record agent trace for session %s", session_id)
        db.rollback()
