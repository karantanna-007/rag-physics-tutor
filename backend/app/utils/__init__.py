# app/utils/__init__.py
"""
Utility helpers for the RAG Physics Tutor backend.

Modules:

- file_storage: Saving and deleting raw uploaded files (local disk for now).
- ids:          Helper functions for generating unique IDs (e.g., vector IDs).
- pagination:   Common pagination utilities for list and DB query results.
"""

from . import file_storage, ids, pagination  # noqa: F401

__all__ = ["file_storage", "ids", "pagination"]
