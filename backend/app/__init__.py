"""
App package for the RAG Physics Tutor backend.

This package contains:

- core:      Application configuration, security, logging, and shared dependencies.
- db:        Database engine & session management for NeonDB (PostgreSQL).
- models:    SQLAlchemy models representing the relational schema.
- schemas:   Pydantic models for request/response validation.
- api:       Versioned API routers (auth, chat, files, health).
- services:  Business logic not tied directly to HTTP (auth, chat, file handling).
- rag:       LangChain-based RAG components (embeddings, vectorstore, agent, tools).
- ingestion: Document ingestion pipeline (load → split → embed → store).
- utils:     Helper utilities (file storage, ID generation, pagination).
- tests:     Unit and integration tests (to be implemented gradually).

The main FastAPI application is created in `main.py` at the project root,
which imports and wires together pieces from this package.
"""

__all__ = [
    "core",
    "db",
    "models",
    "schemas",
    "api",
    "services",
    "rag",
    "ingestion",
    "utils",
    "tests",
]
