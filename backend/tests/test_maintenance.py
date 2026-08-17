"""Tests for periodic data cleanup."""

from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.conversation import AgentTrace, Conversation, Message
from app.services.maintenance import cleanup_expired_data

from tests.conftest import auth_headers


def test_cleanup_expired_agent_trace(db: Session) -> None:
    old = datetime.now() - timedelta(days=100)
    db.add(AgentTrace(session_id="cleanup-test-old", agent="x", tool="y", created_at=old))
    db.add(AgentTrace(session_id="cleanup-test-new", agent="x", tool="y"))
    db.commit()

    result = cleanup_expired_data(db)
    assert result["agent_trace"] >= 1

    remaining = db.query(AgentTrace).filter(AgentTrace.session_id == "cleanup-test-old").count()
    assert remaining == 0
    kept = db.query(AgentTrace).filter(AgentTrace.session_id == "cleanup-test-new").count()
    assert kept == 1


def test_cleanup_expired_conversation_cascades(db: Session) -> None:
    old = datetime.now() - timedelta(days=200)
    conv = Conversation(session_id="cleanup-conv-old", created_at=old)
    db.add(conv)
    db.flush()
    db.add(Message(conversation_id=conv.id, role="user", content="hi", created_at=old))
    db.commit()

    result = cleanup_expired_data(db)
    assert result["conversation"] >= 1
    assert db.query(Conversation).filter_by(session_id="cleanup-conv-old").count() == 0


def test_cleanup_keeps_recent_records(db: Session) -> None:
    recent = datetime.now() - timedelta(days=1)
    db.add(AgentTrace(session_id="cleanup-recent", agent="x", tool="y", created_at=recent))
    db.commit()

    cleanup_expired_data(db)
    assert db.query(AgentTrace).filter_by(session_id="cleanup-recent").count() == 1


def test_trigger_cleanup_requires_admin(client: TestClient) -> None:
    resp = client.post("/api/maintenance/cleanup", headers=auth_headers(1, "OWNER"))
    assert resp.status_code == 403


def test_trigger_cleanup_as_admin(client: TestClient) -> None:
    resp = client.post("/api/maintenance/cleanup", headers=auth_headers(201, "ADMIN"))
    assert resp.status_code == 200
    assert "cleaned" in resp.json()
