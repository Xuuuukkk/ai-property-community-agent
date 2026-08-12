"""Common Pydantic schemas shared across API modules."""

from pydantic import BaseModel, ConfigDict


class PageParams(BaseModel):
    """Shared pagination query parameters."""

    page: int = 1
    page_size: int = 20


class PageInfo(BaseModel):
    """Pagination metadata returned in list responses."""

    model_config = ConfigDict(from_attributes=True)

    page: int
    page_size: int
    total: int
    pages: int


class ListResponse(BaseModel):
    """Generic list response wrapper.

    Subclasses should provide a concrete ``items`` field with the correct type.
    """

    pagination: PageInfo
