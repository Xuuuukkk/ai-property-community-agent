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
    assert data["user_id"] == 1


def test_create_issue_auto_dispatches_by_zone(client: TestClient) -> None:
    """A zoned report is auto-assigned to a zone admin and marked processing."""
    resp = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    )
    data = resp.json()
    assert data["status"] == "processing"
    assert data["assignee_id"] in (202, 203)  # 东区 candidate admins
    assert data["assignee_name"]


def test_create_issue_without_zone_stays_submitted(client: TestClient) -> None:
    """A complaint without a zone is not auto-dispatched."""
    resp = client.post(
        "/api/issues",
        json=_issue_payload(category="complaint", zone=None, location=None),
        headers=auth_headers(1, "OWNER"),
    )
    data = resp.json()
    assert data["status"] == "submitted"
    assert data["assignee_id"] is None


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


def test_reply_issue_as_assignee(client: TestClient) -> None:
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    assignee_id = created["assignee_id"]
    assert assignee_id is not None
    resp = client.post(
        f"/api/issues/{created['id']}/reply",
        json={"reply": "已联系工程部维修"},
        headers=auth_headers(assignee_id, "ADMIN"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "resolved"
    assert data["reply"] == "已联系工程部维修"


def test_reply_issue_rejects_non_assignee(client: TestClient) -> None:
    """A non-assignee admin cannot fill in the feedback."""
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    assignee_id = created["assignee_id"]
    # Pick a different admin id.
    other_admin = 201 if assignee_id != 201 else 210
    resp = client.post(
        f"/api/issues/{created['id']}/reply",
        json={"reply": "越权答复"},
        headers=auth_headers(other_admin, "ADMIN"),
    )
    assert resp.status_code == 403


def test_list_issues_mine_filter(client: TestClient) -> None:
    """mine=true returns only issues assigned to the current admin."""
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    assignee_id = created["assignee_id"]

    mine = client.get("/api/issues?mine=true", headers=auth_headers(assignee_id, "ADMIN")).json()
    assert all(item["assignee_id"] == assignee_id for item in mine["items"])

    # Another admin with no assigned issues sees none (in a fresh test DB there
    # may be other issues, so just assert they are all assigned to them).
    other_admin = 201 if assignee_id != 201 else 210
    other = client.get("/api/issues?mine=true", headers=auth_headers(other_admin, "ADMIN")).json()
    assert all(item["assignee_id"] == other_admin for item in other["items"])


def test_create_issue_requires_auth(client: TestClient) -> None:
    resp = client.post("/api/issues", json=_issue_payload())
    assert resp.status_code == 401
