"""User repository."""

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for the ``user`` table (PostgreSQL reserved word)."""

    def __init__(self):
        super().__init__(User)


user_repository = UserRepository()
