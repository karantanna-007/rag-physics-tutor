# app/db/base.py

from sqlalchemy.orm import declarative_base

# Base class for all SQLAlchemy models
Base = declarative_base()

# IMPORTANT:
# Import all models here so that they are registered with Base.metadata.
# This ensures Base.metadata.create_all(bind=engine) actually creates tables.
from app.models.user import User  # noqa: F401
from app.models.file import File  # noqa: F401
from app.models.chunk_metadata import ChunkMetadata  # noqa: F401
from app.models.topic import Topic  # noqa: F401
from app.models.formula import Formula  # noqa: F401
from app.models.conversation import Conversation  # noqa: F401
from app.models.message import Message  # noqa: F401

__all__ = [
    "Base",
    "User",
    "File",
    "ChunkMetadata",
    "Topic",
    "Formula",
    "Conversation",
    "Message",
]
