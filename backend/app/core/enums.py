"""Shared enumeration/string constants used by models, schemas, and services.

We intentionally use plain string columns in the database (not PostgreSQL
native enums) so that the seed SQL files can be imported without conversion.
"""

from enum import StrEnum


class UserRole(StrEnum):
    OWNER = "OWNER"
    PROPERTY_STAFF = "PROPERTY_STAFF"
    WORKER = "WORKER"
    ADMIN = "ADMIN"


class HouseStatus(StrEnum):
    VACANT = "VACANT"
    OCCUPIED = "OCCUPIED"


class WorkerDepartment(StrEnum):
    MANAGEMENT = "management"
    ENGINEERING = "engineering"
    CLEANING = "cleaning"
    SECURITY = "security"


class WorkerStatus(StrEnum):
    ON_DUTY = "ON_DUTY"
    OFF_DUTY = "OFF_DUTY"
    ON_LEAVE = "ON_LEAVE"


class RepairType(StrEnum):
    WATER_LEAK = "water_leak"
    ELEVATOR_FAULT = "elevator_fault"
    ACCESS_CONTROL = "access_control"
    POWER_TRIP = "power_trip"
    WALL_SEEPAGE = "wall_seepage"
    PUBLIC_FACILITY = "public_facility"


class RepairUrgency(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class RepairStatus(StrEnum):
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CLOSED = "CLOSED"


class FeeBillType(StrEnum):
    PROPERTY_FEE = "property_fee"
    PARKING_FEE = "parking_fee"
    UTILITY_FEE = "utility_fee"
    MAINTENANCE_FEE = "maintenance_fee"


class FeeBillStatus(StrEnum):
    PAID = "PAID"
    UNPAID = "UNPAID"
    OVERDUE = "OVERDUE"


class NoticeType(StrEnum):
    WATER_POWER_OUTAGE = "water_power_outage"
    ELEVATOR_MAINTENANCE = "elevator_maintenance"
    FIRE_INSPECTION = "fire_inspection"
    COMMUNITY_ACTIVITY = "community_activity"
    PUBLIC_REVENUE = "public_revenue"
    COMMITTEE_NOTICE = "committee_notice"
    WEATHER_ALERT = "weather_alert"
    FACILITY_NOTICE = "facility_notice"


class NoticeStatus(StrEnum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"
