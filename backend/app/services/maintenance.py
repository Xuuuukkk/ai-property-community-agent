"""Periodic data cleanup: retention-based row deletion + orphan file removal.

The observability tables (agent_trace, message, conversation) grow fastest and
are safe to trim. Business records (repair orders, fee bills, notices) are
kept indefinitely — they are the system's ledger, not telemetry.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.paths import REPO_ROOT
from app.models.conversation import AgentTrace, Conversation, Message
from app.models.inspection import InspectionRecord
from app.models.issue import IssueReport


def cleanup_expired_data(db: Session) -> dict[str, int]:
    """Delete rows older than their retention window. Returns counts per table."""
    settings = get_settings()
    now = datetime.now()
    result: dict[str, int] = {}

    cutoff = now - timedelta(days=settings.AGENT_TRACE_RETENTION_DAYS)
    result["agent_trace"] = (
        db.query(AgentTrace)
        .filter(AgentTrace.created_at < cutoff)
        .delete(synchronize_session=False)
    )

    cutoff = now - timedelta(days=settings.MESSAGE_RETENTION_DAYS)
    result["message"] = (
        db.query(Message)
        .filter(Message.created_at < cutoff)
        .delete(synchronize_session=False)
    )

    # Conversation deletion cascades to its messages/traces via FK ondelete.
    cutoff = now - timedelta(days=settings.CONVERSATION_RETENTION_DAYS)
    result["conversation"] = (
        db.query(Conversation)
        .filter(Conversation.created_at < cutoff)
        .delete(synchronize_session=False)
    )

    cutoff = now - timedelta(days=settings.INSPECTION_RETENTION_DAYS)
    result["inspection_record"] = (
        db.query(InspectionRecord)
        .filter(InspectionRecord.created_at < cutoff)
        .delete(synchronize_session=False)
    )

    db.commit()
    return result


def cleanup_orphan_files(db: Session, repo_root: Path = REPO_ROOT) -> dict[str, int]:
    """Delete image files on disk that no record references anymore."""
    result: dict[str, int] = {}

    # Inspection screenshots live under inspection-images/.
    inspection_dir = repo_root / "inspection-images"
    if inspection_dir.exists():
        known = {
            path
            for (path,) in db.query(InspectionRecord.image_path)
            .filter(InspectionRecord.image_path.isnot(None))
            .all()
        }
        removed = 0
        for file in inspection_dir.rglob("*"):
            if file.is_file():
                rel = str(file.relative_to(repo_root)).replace("\\", "/")
                if rel not in known:
                    file.unlink(missing_ok=True)
                    removed += 1
        result["inspection_images"] = removed

    # Owner-submitted issue photos live under uploads/issues/.
    uploads_dir = repo_root / "uploads" / "issues"
    if uploads_dir.exists():
        known: set[str] = set()
        for (images,) in db.query(IssueReport.images).filter(IssueReport.images.isnot(None)).all():
            if images:
                known.update(images)
        removed = 0
        for file in uploads_dir.glob("*"):
            if file.is_file():
                rel = f"uploads/issues/{file.name}"
                if rel not in known:
                    file.unlink(missing_ok=True)
                    removed += 1
        result["issue_images"] = removed

    return result


def run_maintenance(db: Session) -> dict[str, int]:
    """Run a full cleanup pass and return counts for every cleanup step."""
    result = cleanup_expired_data(db)
    result.update(cleanup_orphan_files(db))
    return result
