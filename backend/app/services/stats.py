"""Aggregated statistics for the management dashboard."""

from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.building import Building
from app.models.fee_bill import FeeBill
from app.models.house import House
from app.models.inspection import InspectionRecord
from app.models.issue import IssueReport
from app.models.repair_order import RepairOrder
from app.models.user import User

# Repair statuses considered "still open" for pending counts.
_OPEN_REPAIR_STATUSES = ("CREATED", "ASSIGNED", "PROCESSING")
_CLOSED_REPAIR_STATUSES = ("COMPLETED", "CLOSED")


def _safe_rate(numerator: int | float, denominator: int | float) -> float:
    return round(numerator / denominator, 4) if denominator else 0.0


def get_dashboard_stats(db: Session) -> dict:
    """Return aggregated statistics across all business domains."""
    return {
        "repair": _repair_stats(db),
        "fee": _fee_stats(db),
        "inspection": _inspection_stats(db),
        "issue": _issue_stats(db),
        "community": _community_stats(db),
    }


def _repair_stats(db: Session) -> dict:
    total = db.query(func.count(RepairOrder.id)).scalar() or 0

    by_status = dict(
        db.query(RepairOrder.status, func.count(RepairOrder.id))
        .group_by(RepairOrder.status)
        .all()
    )
    by_type = dict(
        db.query(RepairOrder.type, func.count(RepairOrder.id))
        .group_by(RepairOrder.type)
        .all()
    )

    pending = sum(by_status.get(s, 0) for s in _OPEN_REPAIR_STATUSES)
    completed = sum(by_status.get(s, 0) for s in _CLOSED_REPAIR_STATUSES)

    return {
        "total": total,
        "pending": pending,
        "completed": completed,
        "completion_rate": _safe_rate(completed, total),
        "by_status": by_status,
        "by_type": by_type,
    }


def _fee_stats(db: Session) -> dict:
    total_count = db.query(func.count(FeeBill.id)).scalar() or 0
    total_amount = float(db.query(func.coalesce(func.sum(FeeBill.amount), 0)).scalar())

    paid_amount = float(
        db.query(func.coalesce(func.sum(FeeBill.amount), 0))
        .filter(FeeBill.status == "PAID")
        .scalar()
    )
    paid_count = (
        db.query(func.count(FeeBill.id)).filter(FeeBill.status == "PAID").scalar() or 0
    )
    overdue_count = (
        db.query(func.count(FeeBill.id)).filter(FeeBill.status == "OVERDUE").scalar() or 0
    )
    unpaid_count = total_count - paid_count

    return {
        "total_count": total_count,
        "total_amount": round(total_amount, 2),
        "paid_amount": round(paid_amount, 2),
        "paid_count": paid_count,
        "unpaid_count": unpaid_count,
        "overdue_count": overdue_count,
        "collection_rate": _safe_rate(paid_amount, total_amount),
    }


def _inspection_stats(db: Session) -> dict:
    total = db.query(func.count(InspectionRecord.id)).scalar() or 0
    anomaly_count = (
        db.query(func.count(InspectionRecord.id))
        .filter(InspectionRecord.anomaly_type.isnot(None))
        .filter(InspectionRecord.anomaly_type != "")
        .scalar()
        or 0
    )

    rows = db.query(InspectionRecord.anomaly_type, func.count(InspectionRecord.id)).group_by(
        InspectionRecord.anomaly_type
    ).all()
    by_anomaly: dict[str, int] = {}
    for anomaly_type, count in rows:
        by_anomaly[anomaly_type or "正常"] = count

    return {
        "total": total,
        "anomaly_count": anomaly_count,
        "anomaly_rate": _safe_rate(anomaly_count, total),
        "by_anomaly": by_anomaly,
    }


def _issue_stats(db: Session) -> dict:
    total = db.query(func.count(IssueReport.id)).scalar() or 0
    by_status = dict(
        db.query(IssueReport.status, func.count(IssueReport.id))
        .group_by(IssueReport.status)
        .all()
    )
    by_category = dict(
        db.query(IssueReport.category, func.count(IssueReport.id))
        .group_by(IssueReport.category)
        .all()
    )

    return {
        "total": total,
        "submitted": by_status.get("submitted", 0),
        "processing": by_status.get("processing", 0),
        "resolved": by_status.get("resolved", 0),
        "by_category": by_category,
    }


def _community_stats(db: Session) -> dict:
    return {
        "users": db.query(func.count(User.id)).scalar() or 0,
        "houses": db.query(func.count(House.id)).scalar() or 0,
        "buildings": db.query(func.count(Building.id)).scalar() or 0,
    }
