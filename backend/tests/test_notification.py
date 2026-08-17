"""Tests for the notification system."""

from fastapi.testclient import TestClient

from tests.conftest import auth_headers


def _issue_payload():
    return {
        "category": "public_facility",
        "zone": "东区",
        "location": "电梯",
        "description": "3单元电梯门关不上",
    }


def test_issue_dispatch_notifies_assignee(client: TestClient) -> None:
    resp = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    )
    assignee_id = resp.json()["assignee_id"]
    assert assignee_id is not None

    notifs = client.get(
        "/api/notifications", headers=auth_headers(assignee_id, "ADMIN")
    ).json()["items"]
    assert any(n["type"] == "issue_assigned" for n in notifs)


def test_issue_reply_notifies_owner(client: TestClient) -> None:
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    assignee_id = created["assignee_id"]
    client.post(
        f"/api/issues/{created['id']}/reply",
        json={"reply": "已处理"},
        headers=auth_headers(assignee_id, "ADMIN"),
    )

    notifs = client.get("/api/notifications", headers=auth_headers(1, "OWNER")).json()[
        "items"
    ]
    assert any(n["type"] == "issue_replied" for n in notifs)


def test_unread_count_and_mark_read(client: TestClient) -> None:
    # Create an issue so the assignee gets a notification.
    created = client.post(
        "/api/issues", json=_issue_payload(), headers=auth_headers(1, "OWNER")
    ).json()
    assignee_id = created["assignee_id"]
    headers = auth_headers(assignee_id, "ADMIN")

    unread = client.get("/api/notifications/unread-count", headers=headers).json()
    assert unread["count"] >= 1

    # Mark the first unread notification as read.
    notifs = client.get("/api/notifications", headers=headers).json()["items"]
    nid = next(n["id"] for n in notifs if not n["is_read"])
    client.post(f"/api/notifications/{nid}/read", headers=headers)
    after = client.get("/api/notifications/unread-count", headers=headers).json()
    assert after["count"] == unread["count"] - 1


def test_notifications_require_auth(client: TestClient) -> None:
    resp = client.get("/api/notifications")
    assert resp.status_code == 401
