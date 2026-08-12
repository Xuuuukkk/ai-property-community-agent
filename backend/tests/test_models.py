from app.core.enums import (
    FeeBillStatus,
    FeeBillType,
    HouseStatus,
    NoticeStatus,
    NoticeType,
    RepairStatus,
    RepairType,
    RepairUrgency,
    UserRole,
    WorkerDepartment,
    WorkerStatus,
)
from app.models import Base


def test_all_core_tables_registered() -> None:
    expected = {
        "community",
        "building",
        "house",
        "user",
        "house_binding",
        "worker",
        "repair_order",
        "repair_record",
        "fee_bill",
        "notice",
    }
    assert expected.issubset(set(Base.metadata.tables.keys()))


def test_repair_status_matches_seed_data() -> None:
    # Seed data uses 5 statuses (no ACCEPTED).
    assert set(RepairStatus) == {
        RepairStatus.CREATED,
        RepairStatus.ASSIGNED,
        RepairStatus.PROCESSING,
        RepairStatus.COMPLETED,
        RepairStatus.CLOSED,
    }


def test_enum_values_cover_seed_data() -> None:
    assert UserRole.OWNER.value == "OWNER"
    assert UserRole.ADMIN.value == "ADMIN"
    assert HouseStatus.VACANT.value == "VACANT"
    assert HouseStatus.OCCUPIED.value == "OCCUPIED"
    assert WorkerDepartment.ENGINEERING.value == "engineering"
    assert WorkerStatus.ON_DUTY.value == "ON_DUTY"
    assert RepairType.POWER_TRIP.value == "power_trip"
    assert RepairUrgency.URGENT.value == "URGENT"
    assert FeeBillType.UTILITY_FEE.value == "utility_fee"
    assert FeeBillStatus.OVERDUE.value == "OVERDUE"
    assert NoticeType.PUBLIC_REVENUE.value == "public_revenue"
    assert NoticeStatus.PUBLISHED.value == "PUBLISHED"
