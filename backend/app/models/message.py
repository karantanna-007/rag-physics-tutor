# app/models/message.py
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class Message(Base):
    """
    messages table

    Represents a single chat message in a conversation.

    - role: "user" | "assistant" | "system"
    - content: the actual text of the message
    - sources: optional serialized info about which documents were used
               (e.g., JSON string; we'll keep as Text for now)
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
    )

    role = Column(String(50), nullable=False)  # "user" | "assistant" | "system"
    content = Column(Text, nullable=False)

    # You can store JSON-serialized source metadata here
    sources = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=False),
        nullable=False,
        default=datetime.utcnow,
    )

    conversation = relationship("Conversation", back_populates="messages")

    def __repr__(self) -> str:
        return f"<Message id={self.id} conv_id={self.conversation_id} role={self.role!r}>"
