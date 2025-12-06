# app/schemas/common.py
from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class IDModel(BaseModel):
    """
    Base schema that includes an integer primary key ID.
    """
    id: int


class TimestampMixin(BaseModel):
    """
    Mixin with standard timestamp fields.
    """
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Generic pagination response wrapper.
    Example usage:
    - items: list of FileListItem
    - total: total items in DB
    - page: current page number (1-based)
    - size: page size
    """
    items: List[T]
    total: int
    page: int
    size: int
