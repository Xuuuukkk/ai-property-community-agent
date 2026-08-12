"""RepairOrder repository."""

from app.models.repair_order import RepairOrder
from app.repositories.base import BaseRepository


class RepairRepository(BaseRepository[RepairOrder]):
    """Repository for repair orders."""

    def __init__(self):
        super().__init__(RepairOrder)


repair_repository = RepairRepository()
