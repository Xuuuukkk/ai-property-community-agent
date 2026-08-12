"""Repository layer: thin wrappers around SQLAlchemy queries."""

from app.repositories.fee import FeeRepository, fee_repository
from app.repositories.notice import NoticeRepository, notice_repository
from app.repositories.repair import RepairRepository, repair_repository
from app.repositories.user import UserRepository, user_repository

__all__ = [
    "FeeRepository",
    "fee_repository",
    "NoticeRepository",
    "notice_repository",
    "RepairRepository",
    "repair_repository",
    "UserRepository",
    "user_repository",
]
