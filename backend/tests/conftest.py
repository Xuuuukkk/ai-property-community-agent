"""Pytest fixtures for API integration tests.

These fixtures provide a ``TestClient`` whose database dependency is swapped
out for a session that is rolled back after each test, keeping the shared
seed database clean even when endpoints commit transactions.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.core.database import get_db
from app.main import app

settings = get_settings()

# Use the same database as the running backend; tests roll back their changes.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture(scope="function")
def db() -> Session:
    """Yield a session wrapped in a top-level transaction that is rolled back."""
    connection = engine.connect()
    # Outer transaction: will be rolled back after the test.
    outer_transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Begin a nested SAVEPOINT. Application code that calls session.commit()
    # will release this SAVEPOINT, but the outer transaction stays open so
    # nothing is actually committed to the database.
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
