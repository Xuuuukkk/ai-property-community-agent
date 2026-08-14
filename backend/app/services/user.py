"""User service."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user import user_repository


class UserService:
    """Business logic for user-related operations."""

    def get_user(self, db: Session, user_id: int) -> User:
        """Return a user by ID or raise 404."""
        user = user_repository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id={user_id} not found",
            )
        return user

    def list_users(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        role: str | None = None,
    ) -> tuple[list[User], int]:
        """Return a paginated list of users with optional role filter."""
        filters = {"role": role} if role else None
        return user_repository.list_paginated(
            db, page=page, page_size=page_size, filters=filters
        )


user_service = UserService()
