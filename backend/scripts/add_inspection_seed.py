"""Add inspection cameras + records so the demo has patrol data to show.

This script is **idempotent** (safe to re-run): it skips cameras / records
that already exist, so it never duplicates data.

Image paths stored in DB are relative to the repository root
(e.g. ``inspection-images/camera_1/xxx.jpg``), which maps to
``/app/inspection-images/...`` inside the backend container (mounted via
docker-compose).

Usage inside the backend container:

    docker compose exec backend python -m scripts.add_inspection_seed

To customize which images to import, edit the ``PICKS`` mapping below.
"""

from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.inspection import InspectionCamera, InspectionRecord


# (camera_id, name, zone, location, manager) — synthetic demo cameras.
CAMERAS: list[tuple[int, str, str, str, str]] = [
    (1, "1号楼大厅入口", "东区", "1号楼一层门厅", "李经理"),
    (2, "2号楼电梯口", "东区", "2号楼一层电梯厅", "李经理"),
    (3, "地下车库入口", "北区", "B1层车库坡道口", "王主管"),
    (4, "中庭花园", "中区", "8栋中庭绿化带", "李经理"),
]

# Filenames to import for each camera (relative to inspection-images/camera_<id>/).
# Picked for visual variety and to ensure at least 1–2 records per camera.
PICKS: dict[int, list[str]] = {
    1: [
        "20260818_123105.jpg",
        "20260819_165718.jpg",
    ],
    2: [
        "20260818_145738.jpg",
        "20260819_165723.jpg",
    ],
    3: [
        "20260818_155742.jpg",
        "20260819_165728.jpg",
    ],
    # camera_4 has no images in the directory; skip.
}


def main() -> None:
    # In the container WORKDIR=/app, and ./inspection-images is bind-mounted
    # at /app/inspection-images — so the absolute path is /app/inspection-images.
    image_root = Path("/app/inspection-images")

    if not image_root.is_dir():
        print(f"inspection-images directory not found: {image_root}", file=sys.stderr)
        sys.exit(1)

    with SessionLocal() as session:
        for cam_id, name, zone, location, manager in CAMERAS:
            existing = session.execute(
                select(InspectionCamera).where(InspectionCamera.id == cam_id)
            ).scalar_one_or_none()
            if existing is None:
                session.add(
                    InspectionCamera(
                        id=cam_id,
                        name=name,
                        zone=zone,
                        location=location,
                        manager=manager,
                        provider_type="local_dir",
                        source_config={"directory": f"/app/inspection-images/camera_{cam_id}"},
                        enabled=True,
                    )
                )
                print(f"[+] camera {cam_id}: {name}")
            else:
                print(f"[=] camera {cam_id} already exists, skipped")

            for filename in PICKS.get(cam_id, []):
                image_path = f"inspection-images/camera_{cam_id}/{filename}"
                # Skip if this (camera_id, image_path) already exists.
                dup = session.execute(
                    select(InspectionRecord).where(
                        InspectionRecord.camera_id == cam_id,
                        InspectionRecord.image_path == image_path,
                    )
                ).scalar_one_or_none()
                if dup is not None:
                    print(f"    [=] record {filename} already exists, skipped")
                    continue

                # The demo images are clean scenes captured by the patrol
                # system; treat them as "no anomaly detected" runs so the
                # frontend's inspection page can render the gallery.
                session.add(
                    InspectionRecord(
                        camera_id=cam_id,
                        image_path=image_path,
                        anomaly_type=None,
                        confidence=0.96,
                        summary="巡检未发现异常，画面整洁。",
                        bbox=None,
                        status="success",
                    )
                )
                print(f"    [+] record {filename}")

        session.commit()
    print("done.")


if __name__ == "__main__":
    main()
