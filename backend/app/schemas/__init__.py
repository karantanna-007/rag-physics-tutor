# app/schemas/__init__.py
"""
Pydantic schemas for the RAG Physics Tutor backend.

These define the shapes of:
- Requests coming from the frontend
- Responses returned by the API
"""

from .common import IDModel, TimestampMixin, PaginatedResponse  # noqa: F401
from .user import UserBase, UserCreate, UserRead  # noqa: F401
from .auth import LoginRequest, RegisterRequest, TokenResponse  # noqa: F401
from .file import FileListItem, FileUploadResponse  # noqa: F401
from .chat import (
    ChatRequest,
    ChatResponse,
    ChatMessageSchema,
    SourceCitationSchema,
)  # noqa: F401

__all__ = [
    # common
    "IDModel",
    "TimestampMixin",
    "PaginatedResponse",
    # user
    "UserBase",
    "UserCreate",
    "UserRead",
    # auth
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    # file
    "FileListItem",
    "FileUploadResponse",
    # chat
    "ChatRequest",
    "ChatResponse",
    "ChatMessageSchema",
    "SourceCitationSchema",
]
