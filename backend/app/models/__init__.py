# app/models/__init__.py
"""
SQLAlchemy models for the RAG Physics Tutor backend.

Tables include:

- User:           Registered users (students, admin).
- File:           Uploaded documents metadata (not the raw file content).
- ChunkMetadata:  Mapping of vector IDs (Pinecone) to file/page/topic info.
- Topic:          Physics topics hierarchy.
- Formula:        Physics formulas linked to topics.
- Conversation:   Chat sessions per user.
- Message:        Individual messages in a conversation.
"""

from .user import User  # noqa: F401
from .file import File  # noqa: F401
from .chunk_metadata import ChunkMetadata  # noqa: F401
from .topic import Topic  # noqa: F401
from .formula import Formula  # noqa: F401
from .conversation import Conversation  # noqa: F401
from .message import Message  # noqa: F401

__all__ = [
    "User",
    "File",
    "ChunkMetadata",
    "Topic",
    "Formula",
    "Conversation",
    "Message",
]
