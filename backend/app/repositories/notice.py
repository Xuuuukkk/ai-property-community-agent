"""Notice repository."""

from app.models.notice import Notice
from app.repositories.base import BaseRepository


class NoticeRepository(BaseRepository[Notice]):
    """Repository for community notices."""

    def __init__(self):
        super().__init__(Notice)


notice_repository = NoticeRepository()
