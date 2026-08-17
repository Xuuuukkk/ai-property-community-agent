"""Tests for the automated patrol inspection feature."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.vision import _parse_json_result
from app.schemas.inspection import CameraCreate
from app.services.camera_providers import LocalDirProvider, get_camera_provider
from app.services.inspection import inspection_service
from tests.conftest import auth_headers


class _FakeVision:
    """Fake vision provider returning a fixed anomaly result."""

    def analyze_image(self, image_bytes: bytes) -> dict:
        return {"anomaly_type": "垃圾堆积", "confidence": 0.9, "summary": "垃圾桶旁有垃圾堆积"}


def test_parse_json_result_plain() -> None:
    result = _parse_json_result('{"anomaly_type": "车辆违停", "confidence": 0.8, "summary": "x"}')
    assert result["anomaly_type"] == "车辆违停"
    assert result["confidence"] == 0.8


def test_parse_json_result_strips_fence() -> None:
    result = _parse_json_result('```json\n{"anomaly_type": null, "confidence": 0, "summary": "正常"}\n```')
    assert result["anomaly_type"] is None
    assert result["summary"] == "正常"


def test_parse_json_result_fallback_to_text() -> None:
    result = _parse_json_result("这不是 JSON")
    assert result["anomaly_type"] is None
    assert result["summary"] == "这不是 JSON"


def test_local_dir_provider_reads_image(tmp_path) -> None:
    img = tmp_path / "shot.jpg"
    img.write_bytes(b"fake-image-bytes")
    provider = LocalDirProvider()
    assert provider.capture({"directory": str(tmp_path)}) == b"fake-image-bytes"


def test_local_dir_provider_empty_dir(tmp_path) -> None:
    provider = LocalDirProvider()
    with pytest.raises(FileNotFoundError):
        provider.capture({"directory": str(tmp_path)})


def test_get_camera_provider_unknown() -> None:
    with pytest.raises(ValueError):
        get_camera_provider("nope")


def test_create_and_list_cameras(db: Session) -> None:
    payload = CameraCreate(
        name="东门垃圾桶",
        provider_type="local_dir",
        source_config={"directory": "/data/inspect"},
    )
    camera = inspection_service.create_camera(db, payload=payload)
    assert camera.id is not None

    cameras = inspection_service.list_cameras(db)
    assert any(c.name == "东门垃圾桶" for c in cameras)


def test_run_inspection_records_anomaly(db: Session, tmp_path, monkeypatch) -> None:
    camera = inspection_service.create_camera(
        db,
        payload=CameraCreate(name="测试点", provider_type="local_dir", source_config={"directory": str(tmp_path)}),
    )
    (tmp_path / "a.jpg").write_bytes(b"fake-image-bytes")

    monkeypatch.setattr("app.services.inspection.get_vision_provider", lambda: _FakeVision())
    monkeypatch.setattr(
        "app.services.inspection.InspectionService._save_image",
        staticmethod(lambda camera_id, image_bytes: "inspection-images/test.jpg"),
    )

    record = inspection_service.run_inspection(db, camera)
    assert record.status == "success"
    assert record.anomaly_type == "垃圾堆积"
    assert record.confidence == 0.9
    assert record.summary == "垃圾桶旁有垃圾堆积"


def test_run_inspection_records_error_without_vision(db: Session, tmp_path, monkeypatch) -> None:
    camera = inspection_service.create_camera(
        db,
        payload=CameraCreate(name="无模型测试", provider_type="local_dir", source_config={"directory": str(tmp_path)}),
    )
    (tmp_path / "a.jpg").write_bytes(b"fake-image-bytes")

    # No vision provider configured -> run is recorded as an error, not raised.
    monkeypatch.setattr("app.services.inspection.get_vision_provider", lambda: None)

    record = inspection_service.run_inspection(db, camera)
    assert record.status == "error"
    assert record.error is not None


def test_inspection_api_requires_staff(client: TestClient) -> None:
    """Owner cannot access inspection endpoints."""
    assert client.get("/api/inspection/cameras", headers=auth_headers(1, "OWNER")).status_code == 403
    assert client.get("/api/inspection/records", headers=auth_headers(1, "OWNER")).status_code == 403


def test_inspection_api_list_as_staff(client: TestClient) -> None:
    assert client.get("/api/inspection/cameras", headers=auth_headers(201, "ADMIN")).status_code == 200
    assert client.get("/api/inspection/records", headers=auth_headers(201, "ADMIN")).status_code == 200
