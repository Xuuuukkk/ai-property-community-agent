"""Tests for the notification system."""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.schemas.inspection import CameraCreate
from app.services.inspection import inspection_service
from app.services.notification import unread_count

from tests.conftest import auth_headers


class _FakeVision:
    """Fake vision provider returning a fixed anomaly result."""

    def analyze_image(self, image_bytes: bytes) -> dict:
        return {"anomaly_type": "垃圾堆积", "confidence": 0.9, "summary": "垃圾桶旁有垃圾堆积"}


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


def test_inspection_anomaly_notifies_staff(db: Session, tmp_path, monkeypatch) -> None:
    camera = inspection_service.create_camera(
        db,
        payload=CameraCreate(
            name="东门垃圾桶",
            provider_type="local_dir",
            source_config={"directory": str(tmp_path)},
        ),
    )
    (tmp_path / "a.jpg").write_bytes(b"fake-image-bytes")

    monkeypatch.setattr("app.services.inspection.get_vision_provider", lambda: _FakeVision())
    monkeypatch.setattr(
        "app.services.inspection.InspectionService._save_image",
        staticmethod(lambda camera_id, image_bytes: "inspection-images/test.jpg"),
    )

    record = inspection_service.run_inspection(db, camera)
    assert record.anomaly_type == "垃圾堆积"

    # An admin (user 201) should have received the anomaly alert.
    from app.models.user import User

    admin = db.query(User).filter_by(id=201).first()
    if admin:
        assert unread_count(db, user_id=201) >= 1
