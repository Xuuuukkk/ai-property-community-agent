"""Fee service."""

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.enums import FeeBillStatus
from app.models.fee_bill import FeeBill
from app.models.house_binding import HouseBinding
from app.repositories.fee import fee_repository


class FeeService:
    """Business logic for fee bill operations."""

    def list_fees_by_user(
        self,
        db: Session,
        *,
        user_id: int,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[FeeBill], int]:
        """Return a paginated list of fee bills for a given user."""
        return fee_repository.list_paginated(
            db,
            page=page,
            page_size=page_size,
            filters={"user_id": user_id},
        )

    def list_all_fees(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        fee_status: str | None = None,
    ) -> tuple[list[FeeBill], int]:
        """Return a paginated list of all fee bills (management view)."""
        filters: dict = {}
        if fee_status:
            filters["status"] = fee_status
        return fee_repository.list_paginated(
            db,
            page=page,
            page_size=page_size,
            filters=filters,
        )

    def _resolve_house_id(self, db: Session, user_id: int, house_id: int | None) -> int:
        """Return the target house id, resolving from the owner's binding if omitted."""
        if house_id is not None:
            return house_id
        binding = db.execute(
            select(HouseBinding).where(HouseBinding.user_id == user_id)
        ).scalars().first()
        if binding is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"用户 {user_id} 没有绑定房屋，请显式指定 house_id",
            )
        return binding.house_id

    def _build_fee(self, db: Session, *, payload) -> FeeBill:
        """Build (flush, not commit) a single fee bill."""
        house_id = self._resolve_house_id(db, payload.user_id, payload.house_id)
        return fee_repository.create(
            db,
            data={
                "user_id": payload.user_id,
                "house_id": house_id,
                "bill_type": payload.bill_type,
                "period": payload.period,
                "amount": payload.amount,
                "due_date": payload.due_date,
                "status": FeeBillStatus.UNPAID.value,
            },
        )

    def create_fee(self, db: Session, *, payload) -> FeeBill:
        """Create a single fee bill."""
        bill = self._build_fee(db, payload=payload)
        db.commit()
        db.refresh(bill)
        return bill

    def bulk_create_fees(self, db: Session, *, items) -> list[FeeBill]:
        """Create multiple fee bills in one transaction."""
        bills = [self._build_fee(db, payload=item) for item in items]
        db.commit()
        return bills

    def mark_paid(self, db: Session, *, fee_id: int) -> FeeBill:
        """Mark a fee bill as paid and stamp paid_at."""
        bill = fee_repository.get_by_id(db, fee_id)
        if bill is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found",
            )
        if bill.status == FeeBillStatus.PAID.value:
            return bill
        bill.status = FeeBillStatus.PAID.value
        bill.paid_at = datetime.now()
        db.commit()
        db.refresh(bill)
        return bill


fee_service = FeeService()
