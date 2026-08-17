"""Tests for owner-submitted issue reports."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def _issue_payload(**overrides):
    payload = {
        "category": "public_facility",
        "zone": "东区",
        "location": "电梯",
        "description": "3单元电梯门关不上",
    }
    payload.update(overrides)
    return payload


def test_issue_options(client: TestClient) -> None:
    resp = client.get("/api/issues/options", headers=auth_headers(1, "OWNER"))
    assert resp.status_code == 200
    data = resp.json()
    assert "东区" in data["zones"]
    assert "电梯" in data["locations"]
    assert any(c["value"] == "public_facility" for c in data["categories"])


def test_create_issue(client: TestClient) -> None:
    resp = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["category"] == "public_facility"
    assert data["zone"] == "东区"
    assert data["status"] == "submitted"
    assert data["user_id"] == 1


def test_owner_sees_only_own_issues(client: TestClient) -> None:
    # owner 1 submits, then owner 2 submits.
    client.post("/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER"))
    client.post(
        "/api/issues",
        json=_issue_payload(description="另一条"),
        headers=auth_headers(2, "OWNER"),
    )
    resp = client.get("/api/issues", headers=auth_headers(1, "OWNER"))
    items = resp.json()["items"]
    assert all(item["user_id"] == 1 for item in items)


def test_staff_sees_all_issues(client: TestClient) -> None:
    resp = client.get("/api/issues", headers=auth_headers(201, "ADMIN"))
    assert resp.status_code == 200
    assert "items" in resp.json()


def test_reply_issue_requires_staff(client: TestClient) -> None:
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    resp = client.post(
        f"/api/issues/{created['id']}/reply",
        json={"reply": "已处理"},
        headers=auth_headers(1, "OWNER"),
    )
    assert resp.status_code == 403


def test_reply_issue_as_staff(client: TestClient) -> None:
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    resp = client.post(
        f"/api/issues/{created['id']}/reply",
        json={"reply": "已联系工程部维修"},
        headers=auth_headers(201, "ADMIN"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "resolved"
    assert data["reply"] == "已联系工程部维修"


def test_create_issue_requires_auth(client: TestClient) -> None:
    resp = client.post("/api/issues", json=_issue_payload())
    assert resp.status_code == 401
