"""API integration tests for Phase 3 business endpoints.

Tests run against the real PostgreSQL container seeded in Phase 2. Each test
is wrapped in a transaction that is rolled back, so writes do not persist.

Role ids in seed data: OWNER 1-200, ADMIN 201-210, WORKER 211-225,
PROPERTY_STAFF 226-275.
"""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers


def test_get_user(client: TestClient, db: Session) -> None:
    """GET /api/users/{id} returns an existing user (staff can view any)."""
    response = client.get("/api/users/1", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "username" in data
    assert "role" in data


def test_get_user_not_found(client: TestClient) -> None:
    """GET /api/users/{id} returns 404 for a missing user."""
    response = client.get("/api/users/999999", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 404


def test_list_users_requires_staff(client: TestClient) -> None:
    """GET /api/users returns 403 for owners."""
    response = client.get("/api/users", headers=auth_headers(1, "OWNER"))
    assert response.status_code == 403


def test_list_users_as_staff(client: TestClient) -> None:
    """GET /api/users returns 200 for staff."""
    response = client.get("/api/users", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200


def test_list_repairs(client: TestClient) -> None:
    """GET /api/repair/list returns a paginated list for staff."""
    response = client.get("/api/repair/list", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert data["pagination"]["total"] > 0


def test_list_repairs_with_filters(client: TestClient) -> None:
    """GET /api/repair/list supports filtering by status."""
    response = client.get(
        "/api/repair/list?status=CREATED", headers=auth_headers(201, "ADMIN")
    )
    assert response.status_code == 200
    data = response.json()
    assert all(item["status"] == "CREATED" for item in data["items"])


def test_get_repair(client: TestClient) -> None:
    """GET /api/repair/{id} returns an existing repair order."""
    response = client.get("/api/repair/1", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["order_no"]
    assert "status" in data


def test_get_repair_not_found(client: TestClient) -> None:
    """GET /api/repair/{id} returns 404 for a missing repair order."""
    response = client.get("/api/repair/999999", headers=auth_headers(201, "ADMIN"))
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
    response = client.post(
        "/api/repair", json=payload, headers=auth_headers(1, "OWNER")
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == 1
    assert data["status"] == "ASSIGNED"
    assert data["order_no"].startswith("RO")
    assert "worker" in data


def test_create_repair_forces_owner_identity(client: TestClient) -> None:
    """POST /api/repair by an owner cannot create for another user."""
    payload = {
        "user_id": 2,
        "house_id": 1,
        "type": "WATER_LEAK",
        "description": "Spoofed",
        "urgency": "LOW",
    }
    response = client.post(
        "/api/repair", json=payload, headers=auth_headers(1, "OWNER")
    )
    assert response.status_code == 201
    assert response.json()["user_id"] == 1  # forced to self


def test_assign_repair_requires_staff(client: TestClient) -> None:
    """POST /api/repair/{id}/assign returns 403 for owners."""
    response = client.post(
        "/api/repair/1/assign",
        json={"worker_id": 11},
        headers=auth_headers(1, "OWNER"),
    )
    assert response.status_code == 403


def test_assign_repair_as_staff(client: TestClient) -> None:
    """POST /api/repair/{id}/assign works for staff."""
    response = client.post(
        "/api/repair/1/assign",
        json={"worker_id": 11},
        headers=auth_headers(201, "ADMIN"),
    )
    assert response.status_code == 200
    assert response.json()["worker_id"] == 11


def test_list_fees_by_user(client: TestClient) -> None:
    """GET /api/fee/{user_id} returns fee bills for an owner's own account."""
    response = client.get("/api/fee/1", headers=auth_headers(1, "OWNER"))
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert data["pagination"]["total"] >= 0


def test_list_fees_cannot_view_others(client: TestClient) -> None:
    """GET /api/fee/{user_id} returns 403 when an owner views another user."""
    response = client.get("/api/fee/2", headers=auth_headers(1, "OWNER"))
    assert response.status_code == 403


def test_list_fees_as_staff(client: TestClient) -> None:
    """GET /api/fee/{user_id} returns 200 for staff viewing any user."""
    response = client.get("/api/fee/2", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200


def test_create_fee_as_staff(client: TestClient) -> None:
    """POST /api/fee creates a bill as staff, resolving house from binding."""
    payload = {
        "user_id": 1,
        "bill_type": "property_fee",
        "period": "2026-09",
        "amount": "500.00",
        "due_date": "2026-09-30",
    }
    response = client.post("/api/fee", json=payload, headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == 1
    assert data["house_id"] == 577  # user 1's bound house (seed)
    assert data["status"] == "UNPAID"
    assert float(data["amount"]) == 500.0


def test_create_fee_requires_staff(client: TestClient) -> None:
    """POST /api/fee returns 403 for owners."""
    payload = {"user_id": 1, "amount": "100.00"}
    response = client.post("/api/fee", json=payload, headers=auth_headers(1, "OWNER"))
    assert response.status_code == 403


def test_bulk_create_fees(client: TestClient) -> None:
    """POST /api/fee/bulk creates multiple bills in one request."""
    payload = {
        "items": [
            {"user_id": 1, "bill_type": "property_fee", "amount": "300.00", "period": "2026-10"},
            {"user_id": 2, "bill_type": "parking_fee", "amount": "200.00", "period": "2026-10"},
        ]
    }
    response = client.post(
        "/api/fee/bulk", json=payload, headers=auth_headers(201, "ADMIN")
    )
    assert response.status_code == 201
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert all(item["status"] == "UNPAID" for item in data)


def test_mark_fee_paid(client: TestClient) -> None:
    """POST /api/fee/{id}/mark-paid flips UNPAID→PAID and stamps paid_at."""
    created = client.post(
        "/api/fee",
        json={"user_id": 1, "amount": "150.00", "period": "2026-11"},
        headers=auth_headers(201, "ADMIN"),
    ).json()
    response = client.post(
        f"/api/fee/{created['id']}/mark-paid", headers=auth_headers(201, "ADMIN")
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PAID"
    assert data["paid_at"] is not None


def test_mark_fee_paid_requires_staff(client: TestClient) -> None:
    """POST /api/fee/{id}/mark-paid returns 403 for owners."""
    created = client.post(
        "/api/fee",
        json={"user_id": 1, "amount": "150.00"},
        headers=auth_headers(201, "ADMIN"),
    ).json()
    response = client.post(
        f"/api/fee/{created['id']}/mark-paid", headers=auth_headers(1, "OWNER")
    )
    assert response.status_code == 403


def test_list_all_fees_as_staff(client: TestClient) -> None:
    """GET /api/fee returns all bills for staff."""
    response = client.get("/api/fee", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert data["pagination"]["total"] > 0


def test_list_all_fees_requires_staff(client: TestClient) -> None:
    """GET /api/fee returns 403 for owners."""
    response = client.get("/api/fee", headers=auth_headers(1, "OWNER"))
    assert response.status_code == 403


def test_list_all_fees_status_filter(client: TestClient) -> None:
    """GET /api/fee?status=PAID returns only paid bills."""
    response = client.get("/api/fee?status=PAID", headers=auth_headers(201, "ADMIN"))
    assert response.status_code == 200
    data = response.json()
    assert all(item["status"] == "PAID" for item in data["items"])


def test_list_notices(client: TestClient) -> None:
    """GET /api/notices returns a paginated list of notices (public)."""
    response = client.get("/api/notices")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data
    assert len(data["items"]) > 0


def test_create_notice_requires_staff(client: TestClient) -> None:
    """POST /api/notices returns 403 for owners."""
    payload = {
        "title": "Test notice from pytest",
        "content": "This is a test notice.",
        "publisher_id": 1,
        "notice_type": "FACILITY_NOTICE",
        "is_pinned": False,
    }
    response = client.post(
        "/api/notices", json=payload, headers=auth_headers(1, "OWNER")
    )
    assert response.status_code == 403


def test_create_notice_as_staff(client: TestClient) -> None:
    """POST /api/notices creates a new community notice as staff."""
    payload = {
        "title": "Test notice from pytest",
        "content": "This is a test notice.",
        "publisher_id": 1,
        "notice_type": "FACILITY_NOTICE",
        "is_pinned": False,
    }
    response = client.post(
        "/api/notices", json=payload, headers=auth_headers(201, "ADMIN")
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "PUBLISHED"
    assert data["publisher_id"] == 1


def test_unauthenticated_requests_rejected(client: TestClient) -> None:
    """Protected endpoints return 401 without a token."""
    assert client.get("/api/users").status_code == 401
    assert client.get("/api/users/1").status_code == 401
    assert client.get("/api/repair/list").status_code == 401
    assert client.get("/api/repair/1").status_code == 401
    assert client.get("/api/fee/1").status_code == 401
