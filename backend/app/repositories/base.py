"""Generic repository base class for common CRUD operations."""

from typing import Generic, TypeVar

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Minimal generic repository with id-based lookups and pagination helpers."""

    def __init__(self, model: type[ModelType]):
        self.model = model

    def get_by_id(self, db: Session, obj_id: int) -> ModelType | None:
        """Fetch a single record by primary key."""
        return db.get(self.model, obj_id)

    def count(self, db: Session) -> int:
        """Total number of records for this model."""
        return db.query(func.count(self.model.id)).scalar() or 0

    def list_paginated(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        filters: dict | None = None,
        order_by=None,
    ) -> tuple[list[ModelType], int]:
        """Return a paginated list and the total count.

        ``filters`` is a mapping of attribute names to scalar values that are
        matched with equality. ``order_by`` is an optional SQLAlchemy column
        expression (defaults to ``-id``).
        """
        query = db.query(self.model)
        if filters:
            for attr_name, value in filters.items():
                column = getattr(self.model, attr_name, None)
                if column is not None and value is not None:
                    query = query.filter(column == value)

        if order_by is None:
            order_by = self.model.id.desc()

        # Count before ordering: counting with ORDER BY is invalid in PostgreSQL.
        total = query.with_entities(func.count(self.model.id)).scalar() or 0

        offset = (page - 1) * page_size
        items = query.order_by(order_by).offset(offset).limit(page_size).all()
        return items, total

    def create(self, db: Session, *, data: dict) -> ModelType:
        """Create and return a new model instance (caller must commit)."""
        instance = self.model(**data)
        db.add(instance)
        db.flush()
        db.refresh(instance)
        return instance
