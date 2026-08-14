"""Authentication API endpoints."""

from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import create_access_token, get_current_user, verify_password
from app.repositories.user import user_repository
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Authenticate a user and return a JWT access token."""
    user = user_repository.get_by_username(db, payload.username)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    settings = get_settings()
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=expires_delta,
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=int(expires_delta.total_seconds()),
        user=_user_response_with_worker_id(user),
    )


@router.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)) -> UserResponse:
    """Return the currently authenticated user."""
    return _user_response_with_worker_id(current_user)


def _user_response_with_worker_id(user) -> UserResponse:
    """Build a UserResponse and include the linked worker id if present."""
    data = UserResponse.model_validate(user).model_dump()
    if user.worker_profile:
        data["worker_id"] = user.worker_profile.id
    return UserResponse(**data)
