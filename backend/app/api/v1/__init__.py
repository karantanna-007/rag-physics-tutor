# app/api/v1/__init__.py
"""
API v1 package.

Contains all version 1 routers:

- routes_auth:   /auth/... (register, login, me)
- routes_chat:   /chat      (RAG queries)
- routes_files:  /files/... (upload, list, delete)
- routes_health: /health    (health check)
"""

from . import routes_auth, routes_chat, routes_files, routes_health  # noqa: F401

__all__ = [
    "routes_auth",
    "routes_chat",
    "routes_files",
    "routes_health",
]
