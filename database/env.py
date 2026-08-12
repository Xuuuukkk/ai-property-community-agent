"""Alembic environment.

Lives in top-level ``database/`` (per technical-design V2.1 §3). It adds the
``backend/`` directory to ``sys.path`` so it can import the ORM ``Base`` and
the application settings, then targets ``Base.metadata`` for autogenerate.
"""
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# --- Make backend/app importable -------------------------------------------
HERE = os.path.dirname(os.path.abspath(__file__))       # .../database
REPO_ROOT = os.path.dirname(HERE)                        # repo root (local) or /app (container)

# Local layout: repo_root/backend and repo_root/database.
# Container layout: backend code is at /app and database/ is mounted to /app/database.
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
if not os.path.isdir(os.path.join(BACKEND_DIR, "app")):
    BACKEND_DIR = REPO_ROOT
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.core.config import get_settings  # noqa: E402
from app.core.database import Base  # noqa: E402
from app.models import *  # noqa: E402,F403  ensures all ORM tables are registered

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Single source of truth for the DB URL: app settings (env var / .env).
config.set_main_option("sqlalchemy.url", get_settings().DATABASE_URL)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
