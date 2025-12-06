# app/models/chunk_metadata.py
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class ChunkMetadata(Base):
    """
    chunk_metadata table

    Maps text chunks & Pinecone vector IDs back to:

    - file_id
    - page_number
    - topic
    - difficulty

    This is useful for:

    - showing which documents/sources were used
    - debugging retrieval results
    - structured queries (e.g., "all chunks from electromagnetism")
    """
    __tablename__ = "chunk_metadata"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)

    # Vector DB reference
    vector_id = Column(String(255), unique=True, index=True, nullable=False)

    # Optional metadata for better filtering / debugging
    page_number = Column(Integer, nullable=True)
    topic = Column(String(100), nullable=True)
    difficulty = Column(String(50), nullable=True)  # "beginner" | "intermediate" | "advanced"

    created_at = Column(
        DateTime(timezone=False),
        nullable=False,
        default=datetime.utcnow,
    )

    # Relationship back to the File
    file = relationship("File", back_populates="chunks")

    def __repr__(self) -> str:
        return f"<ChunkMetadata id={self.id} vector_id={self.vector_id!r} file_id={self.file_id}>"
