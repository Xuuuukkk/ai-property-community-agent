"""Set a demo password for all existing users.

Run this after importing seed data so accounts can log in with the demo
password. In production this script should not be used.

Usage:
    docker compose exec backend python scripts/set_demo_passwords.py

Or locally with DATABASE_URL set:
    DATABASE_URL=postgresql+psycopg2://admin:password@localhost:5432/property_agent \
        python scripts/set_demo_passwords.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import get_settings  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402

DEMO_PASSWORD = "123456"


def set_demo_passwords() -> None:
    settings = get_settings()
    engine = create_engine(str(settings.DATABASE_URL))
    Session = sessionmaker(bind=engine)

    password_hash = get_password_hash(DEMO_PASSWORD)

    with Session() as session:
        result = session.execute(
            text('UPDATE "user" SET password_hash = :hash'),
            {"hash": password_hash},
        )
        session.commit()
        print(f"Updated {result.rowcount} user(s) with demo password: {DEMO_PASSWORD}")


if __name__ == "__main__":
    set_demo_passwords()
