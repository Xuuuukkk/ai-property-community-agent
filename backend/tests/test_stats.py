"""Tests for dashboard statistics."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def test_dashboard_stats_as_admin(client: TestClient) -> None:
    resp = client.get("/api/stats/dashboard", headers=auth_headers(201, "ADMIN"))
    assert resp.status_code == 200
    data = resp.json()
    for key in ("repair", "fee", "inspection", "issue", "community"):
        assert key in data
    # Known seed data shape.
    assert data["community"]["buildings"] == 8
    assert data["community"]["users"] == 275


def test_dashboard_stats_requires_staff(client: TestClient) -> None:
    resp = client.get("/api/stats/dashboard", headers=auth_headers(1, "OWNER"))
    assert resp.status_code == 403


def test_dashboard_insights(client: TestClient) -> None:
    resp = client.get("/api/stats/insights", headers=auth_headers(201, "ADMIN"))
    assert resp.status_code == 200
    data = resp.json()
    assert "insights" in data
    assert "report" in data
    assert isinstance(data["insights"], list)
