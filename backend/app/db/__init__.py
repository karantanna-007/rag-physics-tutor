# app/db/__init__.py
"""
Database package for the RAG Physics Tutor backend.

This package provides:

- session: SQLAlchemy engine and SessionLocal for NeonDB (PostgreSQL).
- base:    Declarative base class for all SQLAlchemy models.
- init_db: Helper to create tables and seed initial data.
"""

from .session import engine, SessionLocal  # noqa: F401
from .base import Base  # noqa: F401
