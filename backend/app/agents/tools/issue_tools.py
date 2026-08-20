"""Tools for the issue-reporting domain agent (public-area problems)."""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any

from sqlalchemy.orm import Session

from app.services.issue import issue_service


def create_issue(
    db: Session,
    *,
    user_id: int,
    category: str,
    description: str,
    zone: str | None = None,
    location: str | None = None,
    location_detail: str | None = None,
    images: list[str] | None = None,
) -> dict[str, Any]:
    """Submit a public-area issue report and auto-assign by zone."""
    payload = SimpleNamespace(
        category=category,
        zone=zone,
        location=location,
        location_detail=location_detail,
        description=description,
        images=images,
    )
    issue = issue_service.create_issue(db, user_id=user_id, payload=payload)
    return {
        "tool": "create_issue",
        "issue_id": issue.id,
        "category": issue.category,
        "zone": issue.zone,
        "location": issue.location,
        "location_detail": issue.location_detail,
        "status": issue.status,
        "assignee_name": issue.assignee_name,
    }
