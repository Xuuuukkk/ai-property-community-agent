"""Pydantic schemas for the RepairOrder resource."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.common import PageInfo


class RepairCreate(BaseModel):
    """Payload for creating a new repair order."""

    user_id: int = Field(..., description="ID of the user reporting the issue")
    house_id: int | None = Field(None, description="Optional linked house ID")
    type: str = Field(default="water_leak", description="Repair category (e.g. water_leak, elevator_fault, access_control, power_trip, wall_seepage, public_facility)")
    description: str | None = Field(None, description="Detailed problem description")
    urgency: str = Field(default="MEDIUM", description="Urgency level (e.g. LOW, MEDIUM, HIGH, URGENT)")
    image_urls: list[str] | None = Field(None, description="Optional list of image URLs")


class RepairOwnerInfo(BaseModel):
    """Reporter information embedded in repair responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    real_name: str | None
    phone: str | None


class RepairHouseInfo(BaseModel):
    """House address information embedded in repair responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    community_name: str | None
    building_no: str | None
    unit_no: int | None
    floor_no: int | None
    room_no: str | None


class RepairWorkerInfo(BaseModel):
    """Assigned worker information embedded in repair responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    real_name: str | None
    phone: str | None
    department: str | None
    position: str | None


class RepairResponse(BaseModel):
    """Public repair order representation."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    order_no: str
    user_id: int
    house_id: int | None
    worker_id: int | None
    type: str
    description: str | None
    urgency: str
    status: str
    cost: Decimal
    image_urls: list[str] | None = None
    created_at: datetime
    completed_at: datetime | None
    owner_confirmed_at: datetime | None = None
    worker_confirmed_at: datetime | None = None
    owner: RepairOwnerInfo | None = None
    house: RepairHouseInfo | None = None
    worker: RepairWorkerInfo | None = None

    @model_validator(mode="before")
    @classmethod
    def _load_owner_and_house(cls, data: object) -> object:
        if isinstance(data, dict):
            return data
        if not hasattr(data, "user"):
            return data

        # Build a plain dict so we do not mutate the SQLAlchemy instance.
        base = {
            k: v
            for k, v in data.__dict__.items()
            if not k.startswith("_") and k not in ("user", "house", "records", "worker")
        }

        user = getattr(data, "user", None)
        if user is not None:
            base["owner"] = {
                "id": user.id,
                "real_name": getattr(user, "real_name", None),
                "phone": getattr(user, "phone", None),
            }
        else:
            base["owner"] = None

        house = getattr(data, "house", None)
        if house is not None:
            building = getattr(house, "building", None)
            community = getattr(building, "community", None) if building else None
            base["house"] = {
                "id": house.id,
                "community_name": getattr(community, "name", None) if community else None,
                "building_no": getattr(building, "building_no", None) if building else None,
                "unit_no": getattr(house, "unit_no", None),
                "floor_no": getattr(house, "floor_no", None),
                "room_no": getattr(house, "room_no", None),
            }
        else:
            base["house"] = None

        worker = getattr(data, "worker", None)
        if worker is not None:
            worker_user = getattr(worker, "user", None)
            base["worker"] = {
                "id": worker.id,
                "real_name": getattr(worker_user, "real_name", None) if worker_user else None,
                "phone": getattr(worker_user, "phone", None) if worker_user else None,
                "department": getattr(worker, "department", None),
                "position": getattr(worker, "position", None),
            }
        else:
            base["worker"] = None

        return base


class RepairListResponse(BaseModel):
    """Paginated list of repair orders."""

    items: list[RepairResponse]
    pagination: PageInfo
