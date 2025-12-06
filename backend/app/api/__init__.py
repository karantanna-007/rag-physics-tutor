# app/api/__init__.py
"""
API package for the RAG Physics Tutor backend.

This package groups versioned API routers, such as:

- v1: Primary public API (auth, chat, files, health, etc.)

The FastAPI application in `main.py` will typically import and include
routers from `app.api.v1`.
"""

from . import v1  # noqa: F401

__all__ = ["v1"]
