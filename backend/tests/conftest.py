"""Pytest fixtures for API integration tests.

Uses a dedicated ``property_agent_test`` database that is created, migrated,
seeded, and dropped once per test session.  Deterministic embeddings are used
so the suite does not need to download transformer models or call external
APIs.
"""
import os
from pathlib import Path
from urllib.parse import urlparse

os.environ.setdefault("EMBEDDING_MODEL", "deterministic")
os.environ.setdefault("EMBEDDING_DIMENSION", "384")

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core import database as database_module
from app.core.config import get_settings
from app.core.database import get_db
from app.main import app

settings = get_settings()

# Parse the application DATABASE_URL and point it at a test database.
_db_url = urlparse(settings.DATABASE_URL)
TEST_DB_NAME = "property_agent_test"
TEST_DATABASE_URL = settings.DATABASE_URL.replace(
    f"/{_db_url.path.lstrip('/')}", f"/{TEST_DB_NAME}"
)

# Engine connected to the *postgres* database so we can create/drop the test DB.
ADMIN_DATABASE_URL = TEST_DATABASE_URL.replace(f"/{TEST_DB_NAME}", "/postgres")

_SEED_FILES = [
    "community.sql",
    "buildings.sql",
    "houses.sql",
    "users.sql",
    "workers.sql",
    "repair_orders.sql",
    "fee_bills.sql",
    "notices.sql",
]

_SEQUENCE_TABLES = [
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


def _get_seed_dir() -> Path:
    """Locate data/seed relative to the backend directory."""
    backend_dir = Path(__file__).resolve().parent.parent
    local_path = backend_dir.parent / "data" / "seed"
    if local_path.is_dir():
        return local_path
    raise FileNotFoundError("Could not locate data/seed directory")


def _run_alembic_migrations(engine_url: str) -> None:
    """Run Alembic migrations against ``engine_url``."""
    backend_dir = Path(__file__).resolve().parent.parent
    repo_root = backend_dir.parent
    alembic_ini = repo_root / "database" / "alembic.ini"

    # env.py overrides sqlalchemy.url from app settings (DATABASE_URL). Make
    # sure that variable points at the test database during migrations, and
    # clear the settings cache so env.py re-reads it.
    original_db_url = os.environ.get("DATABASE_URL")
    os.environ["DATABASE_URL"] = engine_url
    get_settings.cache_clear()
    try:
        alembic_cfg = Config(str(alembic_ini))
        # Use absolute paths so Alembic works regardless of the current dir.
        alembic_cfg.set_main_option("script_location", str(repo_root / "database"))
        alembic_cfg.set_main_option("prepend_sys_path", str(repo_root))
        alembic_cfg.set_section_option("alembic", "path_separator", "os")
        command.upgrade(alembic_cfg, "head")
    finally:
        if original_db_url is None:
            os.environ.pop("DATABASE_URL", None)
        else:
            os.environ["DATABASE_URL"] = original_db_url
        get_settings.cache_clear()


def _load_seed_data(engine) -> None:
    """Execute seed SQL files and reset id sequences."""
    seed_dir = _get_seed_dir()
    with engine.connect() as connection:
        for filename in _SEED_FILES:
            sql = (seed_dir / filename).read_text(encoding="utf-8")
            connection.execute(text(sql))
        connection.commit()

        # Reset PostgreSQL serial sequences so newly inserted records do not
        # collide with the explicit ids used in the seed files.
        for table in _SEQUENCE_TABLES:
            connection.execute(
                text(
                    f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
                    f"COALESCE((SELECT MAX(id) FROM {table}), 1))"
                )
            )
        connection.commit()


def _alter_vector_dimension_to_384(engine) -> None:
    """Downsize the knowledge_chunk embedding column for deterministic tests."""
    with engine.connect() as connection:
        connection.execute(text("TRUNCATE TABLE knowledge_chunk CASCADE"))
        connection.execute(text("TRUNCATE TABLE knowledge_document CASCADE"))
        connection.execute(
            text(
                "DROP INDEX IF EXISTS ix_knowledge_chunk_embedding_hnsw"
            )
        )
        connection.execute(text("ALTER TABLE knowledge_chunk DROP COLUMN embedding"))
        connection.execute(
            text("ALTER TABLE knowledge_chunk ADD COLUMN embedding vector(384) NOT NULL")
        )
        connection.execute(
            text(
                "CREATE INDEX ix_knowledge_chunk_embedding_hnsw "
                "ON knowledge_chunk USING hnsw (embedding vector_cosine_ops) "
                "WITH (m = 16, ef_construction = 64)"
            )
        )
        connection.commit()

        # Verify the column was actually resized; otherwise deterministic 384-d
        # embeddings cannot be inserted into a 1024-d vector column.
        result = connection.execute(
            text(
                "SELECT atttypmod FROM pg_attribute "
                "WHERE attrelid = 'knowledge_chunk'::regclass AND attname = 'embedding'"
            )
        )
        dim = result.scalar()
        if dim != 384:
            raise RuntimeError(
                f"knowledge_chunk.embedding dimension is {dim}, expected 384. "
                "The ALTER COLUMN resize in the test fixture did not take effect."
            )


def _create_test_db() -> None:
    """Create a fresh isolated test database, dropping any existing one."""
    admin_engine = create_engine(ADMIN_DATABASE_URL, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        # Terminate any lingering connections and drop the old test DB so we
        # always start from a clean migration baseline.
        connection.execute(
            text(
                "SELECT pg_terminate_backend(pid) FROM pg_stat_activity "
                "WHERE datname = :dbname AND pid <> pg_backend_pid()"
            ),
            {"dbname": TEST_DB_NAME},
        )
        connection.execute(text(f'DROP DATABASE IF EXISTS "{TEST_DB_NAME}"'))
        connection.execute(text(f'CREATE DATABASE "{TEST_DB_NAME}"'))
    admin_engine.dispose()


def _drop_test_db() -> None:
    """Drop the isolated test database and terminate lingering connections."""
    admin_engine = create_engine(ADMIN_DATABASE_URL, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        connection.execute(
            text(
                "SELECT pg_terminate_backend(pid) FROM pg_stat_activity "
                "WHERE datname = :dbname AND pid <> pg_backend_pid()"
            ),
            {"dbname": TEST_DB_NAME},
        )
        connection.execute(text(f'DROP DATABASE IF EXISTS "{TEST_DB_NAME}"'))
    admin_engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def test_database():
    """Create, migrate, seed, and finally drop the isolated test database."""
    _create_test_db()

    test_engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    _run_alembic_migrations(TEST_DATABASE_URL)
    _load_seed_data(test_engine)
    _alter_vector_dimension_to_384(test_engine)

    # Redirect the application's database module to the test database so any
    # code that calls database_module.SessionLocal() uses the test DB.
    database_module.engine = test_engine
    database_module.SessionLocal = sessionmaker(
        bind=test_engine, autoflush=False, autocommit=False
    )

    yield test_engine

    # Teardown: close all connections, then drop the database.
    database_module.engine = test_engine  # ensure the module still references it
    test_engine.dispose()
    _drop_test_db()


@pytest.fixture(scope="function")
def db(test_database) -> Session:
    """Yield a session wrapped in a top-level transaction that is rolled back."""
    connection = test_database.connect()
    outer_transaction = connection.begin()
    TestingSessionLocal = sessionmaker(bind=connection)
    session = TestingSessionLocal()

    # Nested SAVEPOINT: application commits release it, outer tx stays open.
    session.begin_nested()

    yield session

    session.close()
    outer_transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db: Session) -> TestClient:
    """Yield a TestClient that uses the rollback-protected test session."""

    def _override_get_db():
        yield db

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
