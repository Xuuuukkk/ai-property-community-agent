"""Import seed SQL files into the property agent database.

Run order (matches data/seed/*.sql header comments):
1. community
2. buildings
3. houses
4. users
5. workers
6. repair_orders
7. fee_bills
8. notices

Usage (inside docker compose):
    docker compose exec backend python scripts/import_seed_data.py

Usage (local venv with DATABASE_URL env set):
    DATABASE_URL=postgresql+psycopg2://admin:password@localhost:5432/property_agent \
        python scripts/import_seed_data.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Allow imports from backend/app when run directly.
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import get_settings  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402


SEED_FILES = [
    "community.sql",
    "buildings.sql",
    "houses.sql",
    "users.sql",
    "workers.sql",
    "repair_orders.sql",
    "fee_bills.sql",
    "notices.sql",
]

# Table names whose id sequences must be reset to MAX(id) after seed import.
# "user" must be quoted because it is a PostgreSQL reserved word.
SEQUENCE_TABLES = [
    "community",
    "building",
    "house",
    '"user"',
    "house_binding",
    "worker",
    "repair_order",
    "repair_record",
    "fee_bill",
    "notice",
]


def get_seed_dir() -> Path:
    """Locate data/seed relative to the repo root."""
    # When running inside the backend container, /app/data/seed is mounted.
    container_path = Path("/app/data/seed")
    if container_path.is_dir():
        return container_path

    # When running locally from backend/, repo root is two levels up.
    local_path = BACKEND_DIR.parent / "data" / "seed"
    if local_path.is_dir():
        return local_path

    raise FileNotFoundError("Could not locate data/seed directory")


def import_seed() -> None:
    settings = get_settings()
    engine = create_engine(str(settings.DATABASE_URL))
    Session = sessionmaker(bind=engine)
    seed_dir = get_seed_dir()

    with Session() as session:
        for filename in SEED_FILES:
            file_path = seed_dir / filename
            if not file_path.exists():
                raise FileNotFoundError(f"Seed file not found: {file_path}")

            sql = file_path.read_text(encoding="utf-8")
            print(f"Importing {filename} ...", flush=True)
            # psycopg2 supports executing multi-statement SQL in one call.
            session.execute(text(sql))
            session.commit()
            print(f"  -> {filename} done", flush=True)

    # Reset PostgreSQL serial sequences so newly inserted records do not collide
    # with the explicit ids used in the seed files.
    with Session() as session:
        print("Resetting id sequences ...", flush=True)
        for table in SEQUENCE_TABLES:
            reset_sql = text(
                f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
                f"COALESCE((SELECT MAX(id) FROM {table}), 1))"
            )
            try:
                session.execute(reset_sql)
            except Exception as exc:  # pragma: no cover - defensive logging
                print(f"  Warning: could not reset sequence for {table}: {exc}", flush=True)
        session.commit()
        print("  -> sequences reset", flush=True)

    # Set a default bcrypt password for every seed user so the authentication
    # system works out of the box in local and CI environments.
    # In production, users should reset or change these passwords.
    with Session() as session:
        print("Setting default passwords for seed users ...", flush=True)
        default_hash = get_password_hash("123456")
        session.execute(
            text("UPDATE \"user\" SET password_hash = :hash WHERE password_hash IS NULL OR password_hash = ''"),
            {"hash": default_hash},
        )
        session.commit()
        print("  -> default passwords set", flush=True)

    print("Seed data import completed successfully.")


if __name__ == "__main__":
    import_seed()
