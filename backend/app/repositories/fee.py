"""FeeBill repository."""

from app.models.fee_bill import FeeBill
from app.repositories.base import BaseRepository


class FeeRepository(BaseRepository[FeeBill]):
    """Repository for fee bills."""

    def __init__(self):
        super().__init__(FeeBill)


fee_repository = FeeRepository()
