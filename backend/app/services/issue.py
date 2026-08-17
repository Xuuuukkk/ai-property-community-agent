"""Issue report service: owner submission and staff reply."""

from __future__ import annotations

import base64
from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import IssueStatus
from app.models.issue import ZONE_ASSIGNEES, IssueReport


class IssueService:
    """Business logic for owner-submitted issue reports."""

    def create_issue(self, db: Session, *, user_id: int, payload) -> IssueReport:
        issue = IssueReport(
            user_id=user_id,
            category=payload.category,
            zone=payload.zone,
            location=payload.location,
            description=payload.description,
            images=self._save_images(payload.images),
            status=IssueStatus.SUBMITTED.value,
        )
        db.add(issue)
        db.flush()  # obtain issue.id before dispatch

        # Auto-dispatch to a zone assignee when the report has a zone.
        if issue.zone and issue.zone in ZONE_ASSIGNEES:
            assignee_id = self._pick_assignee(db, issue.zone)
            if assignee_id is not None:
                issue.assignee_id = assignee_id
                issue.assigned_at = datetime.now()
                issue.status = IssueStatus.PROCESSING.value

        db.commit()
        db.refresh(issue)
        return issue

    @staticmethod
    def _pick_assignee(db: Session, zone: str) -> int | None:
        """Pick the zone candidate with the fewest open issues (load balancing)."""
        candidates = ZONE_ASSIGNEES.get(zone, [])
        if not candidates:
            return None

        open_statuses = (IssueStatus.SUBMITTED.value, IssueStatus.PROCESSING.value)
        loads: list[tuple[int, int]] = []
        for candidate in candidates:
            count = (
                db.query(func.count(IssueReport.id))
                .filter(IssueReport.assignee_id == candidate)
                .filter(IssueReport.status.in_(open_statuses))
                .scalar()
                or 0
            )
            loads.append((count, candidate))
        loads.sort()
        return loads[0][1] if loads else None

    @staticmethod
    def _save_images(images: list[str] | None) -> list[str] | None:
        """Decode base64 data-URL images and persist them to uploads/."""
        if not images:
            return None
        from app.core.paths import REPO_ROOT

        uploads_dir = REPO_ROOT / "uploads" / "issues"
        uploads_dir.mkdir(parents=True, exist_ok=True)

        saved: list[str] = []
        for idx, image in enumerate(images):
            try:
                # Accept both raw base64 and data URLs ("data:image/jpeg;base64,...").
                data = image
                if "," in image:
                    data = image.split(",", 1)[1]
                raw = base64.b64decode(data)
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{idx}.jpg"
                (uploads_dir / filename).write_bytes(raw)
                saved.append(f"uploads/issues/{filename}")
            except Exception:  # noqa: BLE001 - skip malformed images
                continue
        return saved or None

    def get_issue(self, db: Session, issue_id: int) -> IssueReport:
        issue = db.get(IssueReport, issue_id)
        if not issue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Issue with id={issue_id} not found",
            )
        return issue

    def list_issues(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        user_id: int | None = None,
        category: str | None = None,
        issue_status: str | None = None,
        assignee_id: int | None = None,
    ) -> tuple[list[IssueReport], int]:
        query = db.query(IssueReport)
        if user_id is not None:
            query = query.filter(IssueReport.user_id == user_id)
        if category:
            query = query.filter(IssueReport.category == category)
        if issue_status:
            query = query.filter(IssueReport.status == issue_status)
        if assignee_id is not None:
            query = query.filter(IssueReport.assignee_id == assignee_id)

        total = query.with_entities(IssueReport.id).count()
        items = (
            query.order_by(IssueReport.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    def reply_issue(self, db: Session, issue: IssueReport, reply: str) -> IssueReport:
        issue.reply = reply
        issue.status = IssueStatus.RESOLVED.value
        issue.replied_at = datetime.now()
        db.commit()
        db.refresh(issue)
        return issue


issue_service = IssueService()
