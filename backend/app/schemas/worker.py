"""Pydantic schemas for the Worker resource."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class WorkerResponse(BaseModel):
    """Public worker representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    real_name: str | None = Field(None, description="Worker real name from user profile")
    phone: str | None = Field(None, description="Worker phone from user profile")
    department: str
    position: str | None = None
    skill_type: str | None = None
    status: str
    hire_date: date | None = None
    created_at: datetime | None = Field(None, description="Worker account creation time from user profile")

    @model_validator(mode="before")
    @classmethod
    def _pull_from_user(cls, data: object) -> dict:
        result: dict = {}
        if hasattr(data, "__dict__"):
            result = dict(data.__dict__)
        elif isinstance(data, dict):
            result = dict(data)

        user = result.get("user")
        if user is not None:
            result.setdefault("real_name", getattr(user, "real_name", None))
            result.setdefault("phone", getattr(user, "phone", None))
            result.setdefault("created_at", getattr(user, "created_at", None))
        # Remove the ORM relationship to avoid recursion / unexpected data
        result.pop("user", None)
        return result
