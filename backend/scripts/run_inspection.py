"""Run an automated patrol inspection for all enabled cameras.

Intended to be invoked on a schedule (cron / WorkBuddy automation / an
external scheduler). Each invocation captures one image per enabled camera,
analyzes it with the vision model, and writes an inspection record.

Usage:
    python scripts/run_inspection.py

Or locally with DATABASE_URL set:
    DATABASE_URL=postgresql+psycopg2://admin:password@localhost:5432/property_agent \
        python scripts/run_inspection.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import get_settings  # noqa: E402
from app.services.inspection import inspection_service  # noqa: E402


def run() -> int:
    settings = get_settings()
    engine = create_engine(str(settings.DATABASE_URL))
    Session = sessionmaker(bind=engine)

    with Session() as session:
        records = inspection_service.run_all_enabled(session)
        for record in records:
            if record.status == "success":
                anomaly = record.anomaly_type or "正常"
                print(f"[camera {record.camera_id}] {anomaly} (confidence={record.confidence})")
            else:
                print(f"[camera {record.camera_id}] ERROR: {record.error}")
        print(f"Inspected {len(records)} camera(s).")
        return 0


if __name__ == "__main__":
    raise SystemExit(run())
