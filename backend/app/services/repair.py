"""Repair service."""

from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.repair_order import RepairOrder
from app.repositories.repair import repair_repository
from app.schemas.repair import RepairCreate


class RepairService:
    """Business logic for repair order operations."""

    def _generate_order_no(self) -> str:
        """Generate a unique repair order number."""
        suffix = uuid4().hex[:8].upper()
        return f"RO{datetime.now().strftime('%Y%m%d%H%M%S')}{suffix}"

    def create_repair(self, db: Session, *, payload: RepairCreate) -> RepairOrder:
        """Create a new repair order from the validated payload."""
        data = payload.model_dump()
        data["order_no"] = self._generate_order_no()
        data.setdefault("status", "CREATED")
        data.setdefault("cost", 0)

        # Normalize type/urgency strings to lowercase values stored in the DB.
        data["type"] = (data.get("type") or "water_leak").lower()
        data["urgency"] = (data.get("urgency") or "MEDIUM").upper()

        repair = repair_repository.create(db, data=data)
        db.commit()
        return repair

    def get_repair(self, db: Session, repair_id: int) -> RepairOrder:
        """Return a repair order by ID or raise 404."""
        repair = repair_repository.get_by_id(db, repair_id)
        if not repair:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Repair order with id={repair_id} not found",
            )
        return repair

    def list_repairs(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        user_id: int | None = None,
        status: str | None = None,
    ) -> tuple[list[RepairOrder], int]:
        """Return a paginated list of repair orders with optional filters."""
        filters: dict[str, object] = {}
        if user_id is not None:
            filters["user_id"] = user_id
        if status is not None:
            filters["status"] = status
        return repair_repository.list_paginated(
            db,
            page=page,
            page_size=page_size,
            filters=filters,
        )


repair_service = RepairService()
