"""User API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserResponse, UserListResponse
from app.services.user import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    role: str | None = Query(None, description="Filter by user role"),
    db: Session = Depends(get_db),
) -> UserListResponse:
    """Return a paginated list of users."""
    items, total = user_service.list_users(db, page=page, page_size=page_size, role=role)
    return UserListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size,
    )


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)) -> UserResponse:
    """Return a single user by ID."""
    return user_service.get_user(db, user_id)
