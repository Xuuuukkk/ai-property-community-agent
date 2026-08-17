"""Owner-submitted issue report API endpoints."""

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.paths import REPO_ROOT
from app.core.security import get_current_user
from app.models.issue import CATEGORY_LABELS, LOCATIONS, ZONES
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.issue import (
    IssueCreate,
    IssueListResponse,
    IssueOptionsResponse,
    IssueReply,
    IssueResponse,
)
from app.services.issue import issue_service

router = APIRouter(prefix="/issues", tags=["issues"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.get("/options", response_model=IssueOptionsResponse)
def issue_options() -> IssueOptionsResponse:
    """Return preset options for the issue report form (zones/locations/types)."""
    return IssueOptionsResponse(
        zones=ZONES,
        locations=LOCATIONS,
        categories=[
            {"value": value, "label": label} for value, label in CATEGORY_LABELS.items()
        ],
    )


@router.post("", response_model=IssueResponse, status_code=201)
def create_issue(
    payload: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueResponse:
    """Owner submits an issue report (acts as themselves)."""
    return issue_service.create_issue(db, user_id=current_user.id, payload=payload)


@router.get("", response_model=IssueListResponse)
def list_issues(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    category: str | None = Query(None, description="Filter by category"),
    issue_status: str | None = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueListResponse:
    """List issues: owners see only their own; staff see all."""
    user_id = None
    if current_user.role not in _STAFF_ROLES:
        user_id = current_user.id

    items, total = issue_service.list_issues(
        db,
        page=page,
        page_size=page_size,
        user_id=user_id,
        category=category,
        issue_status=issue_status,
    )
    pages = (total + page_size - 1) // page_size
    return IssueListResponse(
        items=items,
        pagination=PageInfo(page=page, page_size=page_size, total=total, pages=pages),
    )


@router.post("/{issue_id}/reply", response_model=IssueResponse)
def reply_issue(
    issue_id: int,
    payload: IssueReply,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueResponse:
    """Property staff replies to an issue and marks it resolved (staff only)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    issue = issue_service.get_issue(db, issue_id)
    return issue_service.reply_issue(db, issue, payload.reply)


@router.get("/images/{filename}")
def get_issue_image(
    filename: str,
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    """Return an uploaded issue photo."""
    path = (REPO_ROOT / "uploads" / "issues" / filename).resolve()
    if not path.is_file() or REPO_ROOT.resolve() not in path.parents:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    return FileResponse(path, media_type="image/jpeg")
