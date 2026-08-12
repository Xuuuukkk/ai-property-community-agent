"""SQLAlchemy engine / session / declarative base.

Phase 1 wires the connection only; ORM models are added in Phase 2 and
mapped onto this ``Base`` so Alembic (in top-level ``database/``) can
autogenerate migrations from ``Base.metadata``.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()


class Base(DeclarativeBase):
    """Declarative base for all ORM models (Phase 2)."""


# Lazy engine — creating it does not open a connection.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    """FastAPI dependency: yield a session and always close it."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
