"""Notice service."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.notice import Notice
from app.repositories.notice import notice_repository
from app.schemas.notice import NoticeCreate


class NoticeService:
    """Business logic for community notice operations."""

    def create_notice(self, db: Session, *, payload: NoticeCreate) -> Notice:
        """Create a new community notice."""
        data = payload.model_dump()
        data.setdefault("status", "PUBLISHED")
        data["notice_type"] = (data.get("notice_type") or "facility_notice").lower()
        notice = notice_repository.create(db, data=data)
        db.commit()
        return notice

    def get_notice(self, db: Session, notice_id: int) -> Notice:
        """Return a notice by ID or raise 404."""
        notice = notice_repository.get_by_id(db, notice_id)
        if not notice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notice with id={notice_id} not found",
            )
        return notice

    def list_notices(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
    ) -> tuple[list[Notice], int]:
        """Return a paginated list of notices with optional status filter."""
        filters: dict[str, object] = {}
        if status is not None:
            filters["status"] = status
        return notice_repository.list_paginated(
            db,
            page=page,
            page_size=page_size,
            filters=filters,
            order_by=Notice.is_pinned.desc(),
        )


notice_service = NoticeService()
