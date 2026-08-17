"""Tests for conversation feedback and knowledge-gap review."""

from fastapi.testclient import TestClient
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.knowledge import KnowledgeChunk

from tests.conftest import auth_headers


def _feedback_payload(**overrides):
    payload = {
        "question": "停车费怎么算？",
        "answer": "停车费每月 200 元。",
        "rating": "up",
    }
    payload.update(overrides)
    return payload


def test_create_feedback_up_no_gap(client: TestClient) -> None:
    resp = client.post(
        "/api/feedback", json=_feedback_payload(), headers=auth_headers(1, "OWNER")
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["rating"] == "up"

    # No knowledge gap should be created for an upvote.
    gaps = client.get(
        "/api/knowledge-gaps", headers=auth_headers(201, "ADMIN")
    ).json()["items"]
    assert not any(g["question"] == "停车费怎么算？" for g in gaps)


def test_create_feedback_down_creates_gap(client: TestClient) -> None:
    client.post(
        "/api/feedback",
        json=_feedback_payload(rating="down", correction="其实是每月 300 元"),
        headers=auth_headers(1, "OWNER"),
    )
    gaps = client.get(
        "/api/knowledge-gaps?status=pending", headers=auth_headers(201, "ADMIN")
    ).json()["items"]
    matched = [g for g in gaps if g["question"] == "停车费怎么算？"]
    assert len(matched) == 1
    assert matched[0]["status"] == "pending"
    assert matched[0]["suggested_answer"] == "其实是每月 300 元"


def test_list_gaps_requires_staff(client: TestClient) -> None:
    resp = client.get("/api/knowledge-gaps", headers=auth_headers(1, "OWNER"))
    assert resp.status_code == 403


def test_approve_gap_writes_knowledge(client: TestClient, db: Session) -> None:
    client.post(
        "/api/feedback",
        json=_feedback_payload(rating="down", correction="充电桩使用需先办卡"),
        headers=auth_headers(1, "OWNER"),
    )
    gaps = client.get(
        "/api/knowledge-gaps?status=pending", headers=auth_headers(201, "ADMIN")
    ).json()["items"]
    gap = next(g for g in gaps if g["question"] == "停车费怎么算？")

    before = db.query(func.count(KnowledgeChunk.id)).scalar() or 0

    resp = client.post(
        f"/api/knowledge-gaps/{gap['id']}/approve",
        json={"answer": "停车费每月 300 元"},
        headers=auth_headers(201, "ADMIN"),
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "approved"

    after = db.query(func.count(KnowledgeChunk.id)).scalar() or 0
    assert after == before + 1


def test_reject_gap(client: TestClient) -> None:
    client.post(
        "/api/feedback",
        json=_feedback_payload(rating="down"),
        headers=auth_headers(1, "OWNER"),
    )
    gaps = client.get(
        "/api/knowledge-gaps?status=pending", headers=auth_headers(201, "ADMIN")
    ).json()["items"]
    gap = next(g for g in gaps if g["question"] == "停车费怎么算？")

    resp = client.post(
        f"/api/knowledge-gaps/{gap['id']}/reject",
        json={},
        headers=auth_headers(201, "ADMIN"),
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "rejected"


def test_feedback_stats(client: TestClient) -> None:
    resp = client.get("/api/feedback/stats", headers=auth_headers(201, "ADMIN"))
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data and "down_rate" in data and "top_problems" in data
