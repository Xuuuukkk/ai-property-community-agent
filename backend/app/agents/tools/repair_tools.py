"""Repair tools exposed to the Repair Agent.

All tools accept a `db` SQLAlchemy Session and delegate to the existing
repair service/repository layer.
"""

from sqlalchemy.orm import Session

from app.schemas.repair import RepairCreate
from app.services.repair import repair_service


def create_repair_order(
    db: Session,
    *,
    user_id: int,
    house_id: int | None,
    type: str,
    description: str,
    urgency: str = "MEDIUM",
) -> dict:
    """Create a new repair order.

    Returns a summary dict with order_id, status and a human-readable message.
    """
    payload = RepairCreate(
        user_id=user_id,
        house_id=house_id,
        type=type,
        description=description,
        urgency=urgency,
    )
    order = repair_service.create_repair(db, payload=payload)
    return {
        "order_id": order.id,
        "order_no": order.order_no,
        "status": order.status,
        "message": f"维修工单已创建，编号：{order.order_no}，当前状态：{order.status}",
    }


def query_repair_order(db: Session, *, order_id: int | None = None, user_id: int | None = None) -> dict:
    """Query repair order(s) by order_id or user_id.

    If order_id is provided, returns that single order. Otherwise returns the
    most recent orders for the user.
    """
    if order_id:
        order = repair_service.get_repair(db, order_id)
        return {
            "order_id": order.id,
            "order_no": order.order_no,
            "type": order.type,
            "status": order.status,
            "urgency": order.urgency,
            "description": order.description,
            "worker_id": order.worker_id,
            "created_at": str(order.created_at),
            "completed_at": str(order.completed_at) if order.completed_at else None,
        }

    if user_id:
        items, total = repair_service.list_repairs(db, user_id=user_id, page=1, page_size=5)
        return {
            "total": total,
            "orders": [
                {
                    "order_id": o.id,
                    "order_no": o.order_no,
                    "type": o.type,
                    "status": o.status,
                    "urgency": o.urgency,
                    "description": o.description,
                    "created_at": str(o.created_at),
                }
                for o in items
            ],
        }

    return {"error": "必须提供 order_id 或 user_id"}


def assign_worker(db: Session, *, order_id: int, worker_id: int) -> dict:
    """Assign a worker to a repair order.

    This is a placeholder implementation. The current repair service does not
    expose a dedicated assign method, so we delegate to status update for now.
    """
    order = repair_service.get_repair(db, order_id)
    order.worker_id = worker_id
    order.status = "ASSIGNED"
    db.commit()
    return {
        "order_id": order.id,
        "order_no": order.order_no,
        "worker_id": worker_id,
        "status": order.status,
        "message": f"工单 {order.order_no} 已指派给维修人员 {worker_id}",
    }


def update_repair_status(db: Session, *, order_id: int, status: str) -> dict:
    """Update the status of a repair order."""
    order = repair_service.get_repair(db, order_id)
    order.status = status
    db.commit()
    return {
        "order_id": order.id,
        "order_no": order.order_no,
        "status": order.status,
        "message": f"工单 {order.order_no} 状态已更新为 {status}",
    }
