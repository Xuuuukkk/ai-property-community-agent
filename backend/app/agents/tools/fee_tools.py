"""Fee tools exposed to the Fee Agent."""

from sqlalchemy.orm import Session

from app.services.fee import fee_service


def query_house_fee(db: Session, *, user_id: int, page: int = 1, page_size: int = 10) -> dict:
    """Query fee bills for a user."""
    items, total = fee_service.list_fees_by_user(db, user_id=user_id, page=page, page_size=page_size)
    return {
        "tool": "query_house_fee",
        "input": {"user_id": user_id, "page": page, "page_size": page_size},
        "output": {
            "user_id": user_id,
            "total": total,
            "bills": [
                {
                    "bill_id": b.id,
                    "bill_type": b.bill_type,
                    "period": b.period,
                    "amount": str(b.amount),
                    "status": b.status,
                    "due_date": b.due_date,
                    "paid_at": str(b.paid_at) if b.paid_at else None,
                }
                for b in items
            ],
        },
    }


def query_payment_status(db: Session, *, user_id: int) -> dict:
    """Summarize payment status for a user."""
    items, total = fee_service.list_fees_by_user(db, user_id=user_id, page=1, page_size=1000)
    unpaid = [b for b in items if b.status == "UNPAID"]
    overdue = [b for b in items if b.status == "OVERDUE"]
    paid = [b for b in items if b.status == "PAID"]
    total_unpaid = sum(float(b.amount) for b in unpaid)
    total_overdue = sum(float(b.amount) for b in overdue)

    return {
        "tool": "query_payment_status",
        "input": {"user_id": user_id},
        "output": {
            "user_id": user_id,
            "total_bills": total,
            "paid_count": len(paid),
            "unpaid_count": len(unpaid),
            "overdue_count": len(overdue),
            "total_unpaid": f"{total_unpaid:.2f}",
            "total_overdue": f"{total_overdue:.2f}",
            "message": (
                f"共 {total} 笔账单，已缴 {len(paid)} 笔，"
                f"未缴 {len(unpaid)} 笔（合计 ¥{total_unpaid:.2f}），"
                f"逾期 {len(overdue)} 笔（合计 ¥{total_overdue:.2f}）"
            ),
        },
    }
