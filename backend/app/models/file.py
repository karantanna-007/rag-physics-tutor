# app/models/file.py
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    BigInteger,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class File(Base):
    """
    files table

    Metadata for uploaded documents (PDF, DOCX, etc.)

    - We store only metadata here (filename, path, size, mime type).
    - The raw file bytes live in the local uploads folder (or S3-like storage later).
    """
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)  # e.g. UUID-based
    content_type = Column(String(100), nullable=True)
    size_bytes = Column(BigInteger, nullable=True)

    description = Column(String(500), nullable=True)

    uploaded_at = Column(
        DateTime(timezone=False),
        nullable=False,
        default=datetime.utcnow,
    )

    # Relationships
    owner = relationship("User", back_populates="files")
    chunks = relationship(
        "ChunkMetadata",
        back_populates="file",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<File id={self.id} name={self.original_filename!r} user_id={self.user_id}>"
