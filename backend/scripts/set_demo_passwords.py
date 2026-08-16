"""Set a demo password for all existing users.

Run this after importing seed data so accounts can log in with the demo
password. This is a DEVELOPMENT convenience only.

Safety guard: when ``APP_ENV=production`` this script refuses to run unless
you pass ``--force``, to prevent accidentally resetting every production
account to a single weak password.

Usage:
    docker compose exec backend python scripts/set_demo_passwords.py
    docker compose exec backend python scripts/set_demo_passwords.py --password 888888
    docker compose exec backend python scripts/set_demo_passwords.py --force

Or locally with DATABASE_URL set:
    DATABASE_URL=postgresql+psycopg2://admin:password@localhost:5432/property_agent \
        python scripts/set_demo_passwords.py
"""

from __future__ import annotations

import argparse
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


def set_demo_passwords(password: str) -> int:
    settings = get_settings()
    engine = create_engine(str(settings.DATABASE_URL))
    Session = sessionmaker(bind=engine)

    password_hash = get_password_hash(password)

    with Session() as session:
        result = session.execute(
            text('UPDATE "user" SET password_hash = :hash'),
            {"hash": password_hash},
        )
        session.commit()
        count = result.rowcount
        print(f"Updated {count} user(s) with demo password: {password}")
        return count


def main() -> int:
    parser = argparse.ArgumentParser(description="Set a demo password for all users.")
    parser.add_argument(
        "--password",
        default=DEMO_PASSWORD,
        help=f"Password to set (default: {DEMO_PASSWORD}).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Allow running in production (NOT recommended).",
    )
    args = parser.parse_args()

    settings = get_settings()
    if settings.APP_ENV == "production" and not args.force:
        print(
            "Refusing to run in production: setting a uniform demo password on "
            "all accounts is a security risk. Pass --force only if you really "
            "know what you are doing.",
            file=sys.stderr,
        )
        return 1

    set_demo_passwords(args.password)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
