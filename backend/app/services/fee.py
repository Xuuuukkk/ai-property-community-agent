"""Fee service."""

from sqlalchemy.orm import Session

from app.models.fee_bill import FeeBill
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


fee_service = FeeService()
