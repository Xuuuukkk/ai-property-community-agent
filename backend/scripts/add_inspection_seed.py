"""Add inspection cameras + records so the demo has patrol data to show.

This script is **idempotent** (safe to re-run): it skips cameras / records
that already exist, so it never duplicates data.

Image paths stored in DB are relative to the repository root
(e.g. ``inspection-images/camera_1/xxx.jpg``), which maps to
``/app/inspection-images/...`` inside the backend container (mounted via
docker-compose).

Usage inside the backend container:

    docker compose exec backend python scripts/add_inspection_seed.py

To customize which images to import, edit the ``RECORDS`` table below.
Each entry is ``(camera_id, filename, anomaly_type, summary, confidence)``.
``anomaly_type = None`` means "no anomaly detected" (normal patrol result).
"""

from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import select

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import SessionLocal  # noqa: E402
from app.models.inspection import InspectionCamera, InspectionRecord  # noqa: E402


# (camera_id, name, zone, location, manager) — synthetic demo cameras.
CAMERAS: list[tuple[int, str, str, str, str]] = [
    (1, "1号楼大厅入口", "东区", "1号楼一层门厅", "李经理"),
    (2, "2号楼电梯口", "东区", "2号楼一层电梯厅", "李经理"),
    (3, "地下车库入口", "北区", "B1层车库坡道口", "王主管"),
    (4, "中庭花园", "中区", "8栋中庭绿化带", "李经理"),
]

# Each row: (camera_id, filename, anomaly_type, summary, confidence).
# anomaly_type = None  →  normal patrol run ("no anomaly").
# Filenames are relative to inspection-images/camera_<id>/.
RECORDS: list[tuple[int, str, str | None, str, float]] = [
    # ---- Normal patrol runs (clean hallway / garage / garden scenes) ----
    (1, "20260818_123105.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    (1, "20260819_165718.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    (2, "20260818_145738.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    (2, "20260819_165723.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    (3, "20260818_155742.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    (3, "20260819_165728.jpg", None, "巡检未发现异常，画面整洁。", 0.96),
    # ---- Anomaly runs (AI-generated demo scenes for showcase) ----
    (
        1,
        "20260819_180015.png",
        "garbage_pile",
        "大厅门口发现垃圾堆积，多个黑色垃圾袋散落未及时清运，已通知保洁处置。",
        0.93,
    ),
    (
        2,
        "20260819_180016.png",
        "obstruction",
        "电梯厅堆放大量纸箱杂物，堵塞消防通道，存在安全隐患，已通知业主清理。",
        0.95,
    ),
    (
        3,
        "20260819_180017.png",
        "vehicle_violation",
        "地下车库入口发现车辆违停，堵在禁停网格线上，已通知车主挪车。",
        0.94,
    ),
]


def main() -> None:
    # In the container WORKDIR=/app, and ./inspection-images is bind-mounted
    # at /app/inspection-images — so the absolute path is /app/inspection-images.
    image_root = Path("/app/inspection-images")

    if not image_root.is_dir():
        print(f"inspection-images directory not found: {image_root}", file=sys.stderr)
        sys.exit(1)

    with SessionLocal() as session:
        # 1. Ensure all demo cameras exist.
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

        session.flush()  # ensure cameras are visible to records insert

        # 2. Insert demo patrol records (normal + anomaly).
        for cam_id, filename, anomaly_type, summary, confidence in RECORDS:
            image_path = f"inspection-images/camera_{cam_id}/{filename}"
            dup = session.execute(
                select(InspectionRecord).where(
                    InspectionRecord.camera_id == cam_id,
                    InspectionRecord.image_path == image_path,
                )
            ).scalar_one_or_none()
            if dup is not None:
                print(f"    [=] record cam{cam_id}/{filename} already exists, skipped")
                continue

            # Verify the file actually exists before inserting — avoid dangling
            # DB rows that would 404 in the UI.
            full = image_root / f"camera_{cam_id}" / filename
            if not full.is_file():
                print(
                    f"    [!] file missing on disk: {full}, skipping",
                    file=sys.stderr,
                )
                continue

            session.add(
                InspectionRecord(
                    camera_id=cam_id,
                    image_path=image_path,
                    anomaly_type=anomaly_type,
                    confidence=confidence,
                    summary=summary,
                    bbox=None,
                    status="success",
                )
            )
            tag = "anomaly" if anomaly_type else "normal"
            print(f"    [+] {tag} record cam{cam_id}/{filename}")

        session.commit()
    print("done.")


if __name__ == "__main__":
    main()
