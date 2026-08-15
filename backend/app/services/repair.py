"""Repair service."""

from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.building import Building
from app.models.house import House
from app.models.repair_order import RepairOrder
from app.models.worker import Worker
from app.repositories.repair import repair_repository
from app.schemas.repair import RepairCreate


class RepairService:
    """Business logic for repair order operations."""

    def _generate_order_no(self) -> str:
        """Generate a unique repair order number."""
        suffix = uuid4().hex[:8].upper()
        return f"RO{datetime.now().strftime('%Y%m%d%H%M%S')}{suffix}"

    def _auto_dispatch_worker(self, db: Session, repair: RepairOrder) -> Worker | None:
        """Pick the best available worker for a repair order.

        Priority:
        1. Skill type matches the repair type.
        2. Status is ON_DUTY.
        3. Fewest currently-open orders (in-progress workload), then lowest id
           as a deterministic tie-breaker.
        """
        skill_map = {
            "water_leak": "水电",
            "elevator_fault": "电梯",
            "access_control": "安保",
            "power_trip": "水电",
            "wall_seepage": "水电",
            "public_facility": "维修",
        }
        desired_skill = skill_map.get(repair.type, "维修")

        open_statuses = ("CREATED", "ASSIGNED", "PROCESSING", "IN_PROGRESS")
        open_count = (
            db.query(func.count(RepairOrder.id))
            .filter(RepairOrder.worker_id == Worker.id)
            .filter(RepairOrder.status.in_(open_statuses))
            .correlate(Worker)
            .label("open_count")
        )

        base = db.query(Worker, open_count).filter(Worker.status == "在岗")
        skilled = (
            base.filter(Worker.skill_type.ilike(f"%{desired_skill}%"))
            .order_by(open_count.asc(), Worker.id.asc())
            .first()
        )
        if skilled:
            return skilled[0]
        fallback = base.order_by(open_count.asc(), Worker.id.asc()).first()
        return fallback[0] if fallback else None

    def create_repair(self, db: Session, *, payload: RepairCreate) -> RepairOrder:
        """Create a new repair order from the validated payload."""
        data = payload.model_dump()
        data["order_no"] = self._generate_order_no()
        data.setdefault("status", "CREATED")
        data.setdefault("cost", 0)

        # Normalize type/urgency strings to lowercase values stored in the DB.
        data["type"] = (data.get("type") or "water_leak").lower()
        data["urgency"] = (data.get("urgency") or "MEDIUM").upper()

        repair = repair_repository.create(db, data=data)

        # Auto-dispatch and assign a worker immediately.
        worker = self._auto_dispatch_worker(db, repair)
        if worker is not None:
            repair.worker_id = worker.id
            repair.status = "ASSIGNED"
            db.flush()

        db.commit()
        db.refresh(repair)
        return repair

    def get_repair(self, db: Session, repair_id: int) -> RepairOrder:
        """Return a repair order by ID or raise 404."""
        repair = (
            db.query(RepairOrder)
            .options(
                selectinload(RepairOrder.user),
                selectinload(RepairOrder.house)
                .selectinload(House.building)
                .selectinload(Building.community),
                selectinload(RepairOrder.worker).selectinload(Worker.user),
            )
            .filter(RepairOrder.id == repair_id)
            .first()
        )
        if not repair:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Repair order with id={repair_id} not found",
            )
        return repair

    def list_repairs(
        self,
        db: Session,
        *,
        page: int = 1,
        page_size: int = 20,
        user_id: int | None = None,
        worker_id: int | None = None,
        status: str | None = None,
    ) -> tuple[list[RepairOrder], int]:
        """Return a paginated list of repair orders with optional filters."""
        query = (
            db.query(RepairOrder)
            .options(
                selectinload(RepairOrder.user),
                selectinload(RepairOrder.house)
                .selectinload(House.building)
                .selectinload(Building.community),
                selectinload(RepairOrder.worker).selectinload(Worker.user),
            )
        )
        if user_id is not None:
            query = query.filter(RepairOrder.user_id == user_id)
        if worker_id is not None:
            query = query.filter(RepairOrder.worker_id == worker_id)
        if status is not None:
            query = query.filter(RepairOrder.status == status)

        total = query.with_entities(RepairOrder.id).count()
        offset = (page - 1) * page_size
        items = (
            query.order_by(RepairOrder.id.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )
        return items, total

    def confirm_by_owner(self, db: Session, repair_id: int) -> RepairOrder:
        """Record owner confirmation and complete the order if both sides confirmed."""
        repair = self.get_repair(db, repair_id)
        if repair.owner_confirmed_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner already confirmed this repair order",
            )
        repair.owner_confirmed_at = datetime.now()
        if repair.worker_confirmed_at is not None:
            repair.status = "COMPLETED"
            repair.completed_at = datetime.now()
        db.commit()
        db.refresh(repair)
        return repair

    def confirm_by_worker(self, db: Session, repair_id: int) -> RepairOrder:
        """Record worker confirmation and complete the order if both sides confirmed."""
        repair = self.get_repair(db, repair_id)
        if repair.worker_confirmed_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Worker already confirmed this repair order",
            )
        repair.worker_confirmed_at = datetime.now()
        if repair.owner_confirmed_at is not None:
            repair.status = "COMPLETED"
            repair.completed_at = datetime.now()
        db.commit()
        db.refresh(repair)
        return repair


repair_service = RepairService()
