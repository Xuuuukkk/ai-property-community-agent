"""Inspection service: capture, analyze, and record patrol results."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.vision import get_vision_provider
from app.models.inspection import InspectionCamera, InspectionRecord
from app.services.camera_providers import get_camera_provider


class InspectionService:
    """Business logic for automated patrol inspection."""

    def create_camera(self, db: Session, *, payload) -> InspectionCamera:
        camera = InspectionCamera(
            name=payload.name,
            provider_type=payload.provider_type,
            source_config=payload.source_config,
            enabled=payload.enabled,
        )
        db.add(camera)
        db.commit()
        db.refresh(camera)
        return camera

    def get_camera(self, db: Session, camera_id: int) -> InspectionCamera:
        camera = db.get(InspectionCamera, camera_id)
        if not camera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Inspection camera with id={camera_id} not found",
            )
        return camera

    def list_cameras(self, db: Session) -> list[InspectionCamera]:
        return db.query(InspectionCamera).order_by(InspectionCamera.id).all()

    def list_records(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        camera_id: int | None = None,
    ) -> tuple[list[InspectionRecord], int]:
        query = db.query(InspectionRecord)
        if camera_id is not None:
            query = query.filter(InspectionRecord.camera_id == camera_id)
        total = query.with_entities(InspectionRecord.id).count()
        items = (
            query.order_by(InspectionRecord.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    def run_inspection(self, db: Session, camera: InspectionCamera) -> InspectionRecord:
        """Capture one image, analyze it, and persist a record.

        Errors during capture/analysis are recorded as a failed inspection
        rather than raised, so a single bad camera does not break the loop.
        """
        record = InspectionRecord(camera_id=camera.id, status="success")
        try:
            provider = get_camera_provider(camera.provider_type)
            image_bytes = provider.capture(camera.source_config or {})

            record.image_path = self._save_image(camera.id, image_bytes)

            vision = get_vision_provider()
            if vision is None:
                raise RuntimeError("Vision model is not configured (LLM_API_KEY missing)")

            result = vision.analyze_image(image_bytes)
            record.anomaly_type = result.get("anomaly_type") or None
            record.confidence = result.get("confidence")
            record.summary = result.get("summary")
            record.bbox = result.get("bbox")
            record.raw_result = result
        except Exception as exc:  # noqa: BLE001 - record and return a failed run
            record.status = "error"
            record.error = str(exc)[:500]

        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def run_all_enabled(self, db: Session) -> list[InspectionRecord]:
        """Run an inspection for every enabled camera and return the records."""
        cameras = (
            db.query(InspectionCamera)
            .filter(InspectionCamera.enabled.is_(True))
            .order_by(InspectionCamera.id)
            .all()
        )
        return [self.run_inspection(db, camera) for camera in cameras]

    @staticmethod
    def _save_image(camera_id: int, image_bytes: bytes) -> str:
        """Persist a captured image into a per-camera subdirectory."""
        from app.core.paths import REPO_ROOT

        # Each camera keeps its own subdirectory so shots are stored per source.
        images_dir = REPO_ROOT / "inspection-images" / f"camera_{camera_id}"
        images_dir.mkdir(parents=True, exist_ok=True)
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        path = images_dir / filename
        path.write_bytes(image_bytes)
        return f"inspection-images/camera_{camera_id}/{filename}"


inspection_service = InspectionService()
