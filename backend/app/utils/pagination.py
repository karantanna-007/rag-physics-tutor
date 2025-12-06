# app/utils/pagination.py
from typing import Iterable, List, Sequence, Tuple, TypeVar

from sqlalchemy.orm import Query

from app.schemas.common import PaginatedResponse

T = TypeVar("T")


"""
Pagination utilities.

These helpers give you consistent pagination behavior for:

- SQLAlchemy queries
- In-memory sequences/lists

And a standard PaginatedResponse schema for the API.
"""


def normalize_pagination_params(
    page: int = 1,
    size: int = 20,
    max_size: int = 100,
) -> Tuple[int, int]:
    """
    Ensure page and size are within reasonable bounds.

    - page: 1-based index
    - size: page size
    - max_size: hard upper limit to prevent abuse
    """
    if page < 1:
        page = 1
    if size < 1:
        size = 1
    if size > max_size:
        size = max_size
    return page, size


def paginate_query(
    query: Query,
    page: int = 1,
    size: int = 20,
    max_size: int = 100,
) -> Tuple[List[T], int, int, int]:
    """
    Paginate a SQLAlchemy Query.

    Returns:
    - items: list of results for the requested page
    - total: total number of items in the query
    - page:  normalized page number
    - size:  normalized page size
    """
    page, size = normalize_pagination_params(page, size, max_size)

    total = query.order_by(None).count()  # avoid messing up count with order_by
    offset = (page - 1) * size

    items = query.limit(size).offset(offset).all()
    return items, total, page, size


def paginate_sequence(
    seq: Sequence[T],
    page: int = 1,
    size: int = 20,
    max_size: int = 100,
) -> Tuple[List[T], int, int, int]:
    """
    Paginate an in-memory sequence or list.

    Returns:
    - items: items in the requested slice
    - total: len(seq)
    - page:  normalized page number
    - size:  normalized page size
    """
    page, size = normalize_pagination_params(page, size, max_size)
    total = len(seq)

    start = (page - 1) * size
    end = start + size
    items = list(seq[start:end])

    return items, total, page, size


def build_paginated_response(
    items: Iterable[T],
    total: int,
    page: int,
    size: int,
) -> PaginatedResponse[T]:
    """
    Wrap items into a PaginatedResponse[T].
    """
    return PaginatedResponse[T](
        items=list(items),
        total=total,
        page=page,
        size=size,
    )
