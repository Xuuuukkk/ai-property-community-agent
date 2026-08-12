"""Phase 1 smoke tests for the health endpoints.

These run without a live PostgreSQL/Redis: liveness must be 200, and
readiness must return a structured body reporting each dependency.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["health"] == "/api/health"


def test_liveness():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_readiness_reports_components():
    resp = client.get("/api/health/ready")
    # 200 when deps are up, 503 when down — both are valid, body must be structured.
    assert resp.status_code in (200, 503)
    body = resp.json()
    assert "components" in body
    assert "database" in body["components"]
    assert "redis" in body["components"]
