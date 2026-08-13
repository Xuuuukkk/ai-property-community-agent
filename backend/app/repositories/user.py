"""User repository."""

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for the ``user`` table (PostgreSQL reserved word)."""

    def __init__(self):
        super().__init__(User)

    def get_by_username(self, db: Session, username: str) -> User | None:
        """Fetch a user by unique username."""
        return db.query(User).filter(User.username == username).first()


user_repository = UserRepository()
