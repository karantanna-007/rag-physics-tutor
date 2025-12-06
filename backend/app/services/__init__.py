# app/services/__init__.py
"""
Service layer for the RAG Physics Tutor backend.

These modules contain business logic that is independent of HTTP,
so they can be reused by FastAPI routes, background tasks, or tests.

Modules:

- auth_service:      registration, login, token handling
- user_service:      user fetching and profile operations
- file_service:      file metadata + storage + ingestion trigger
- chat_service:      RAG orchestration for the /chat endpoint
- ingestion_service: document ingestion (load → split → embed → store)
"""

from . import auth_service, user_service, file_service, chat_service, ingestion_service  # noqa: F401

__all__ = [
    "auth_service",
    "user_service",
    "file_service",
    "chat_service",
    "ingestion_service",
]
