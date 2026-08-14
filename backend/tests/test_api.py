"""API integration tests for Phase 3 business endpoints.

Tests run against the real PostgreSQL container seeded in Phase 2. Each test
is wrapped in a transaction that is rolled back, so writes do not persist.
"""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_get_user(client: TestClient, db: Session) -> None:
    """GET /api/users/{id} returns an existing user."""
    response = client.get("/api/users/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "username" in data
    assert "role" in data


def test_get_user_not_found(client: TestClient) -> None:
    """GET /api/users/{id} returns 404 for a missing user."""
    response = client.get("/api/users/999999")
    assert response.status_code == 404


def test_list_repairs(client: TestClient) -> None:
    """GET /api/repair/list returns a paginated list of repair orders."""
    response = client.get("/api/repair/list")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert len(data["items"]) > 0
    assert data["pagination"]["total"] > 0


def test_list_repairs_with_filters(client: TestClient) -> None:
    """GET /api/repair/list supports filtering by status."""
    response = client.get("/api/repair/list?status=CREATED")
    assert response.status_code == 200
    data = response.json()
    assert all(item["status"] == "CREATED" for item in data["items"])


def test_get_repair(client: TestClient) -> None:
    """GET /api/repair/{id} returns an existing repair order."""
    response = client.get("/api/repair/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["order_no"]
    assert "status" in data


def test_get_repair_not_found(client: TestClient) -> None:
    """GET /api/repair/{id} returns 404 for a missing repair order."""
    response = client.get("/api/repair/999999")
    assert response.status_code == 404


def test_create_repair(client: TestClient) -> None:
    """POST /api/repair creates a new repair order and auto-dispatches a worker."""
    payload = {
        "user_id": 1,
        "house_id": 1,
        "type": "WATER_LEAK",
        "description": "Kitchen sink leaking",
        "urgency": "MEDIUM",
    }
    response = client.post("/api/repair", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == 1
    assert data["status"] == "ASSIGNED"
    assert data["order_no"].startswith("RO")
    assert "worker" in data


def test_list_fees_by_user(client: TestClient) -> None:
    """GET /api/fee/{user_id} returns fee bills for a user."""
    response = client.get("/api/fee/1")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert data["pagination"]["total"] >= 0


def test_list_notices(client: TestClient) -> None:
    """GET /api/notices returns a paginated list of notices."""
    response = client.get("/api/notices")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert len(data["items"]) > 0


def test_create_notice(client: TestClient) -> None:
    """POST /api/notices creates a new community notice."""
    payload = {
        "title": "Test notice from pytest",
        "content": "This is a test notice.",
        "publisher_id": 1,
        "notice_type": "FACILITY_NOTICE",
        "is_pinned": False,
    }
    response = client.post("/api/notices", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "PUBLISHED"
    assert data["publisher_id"] == 1
