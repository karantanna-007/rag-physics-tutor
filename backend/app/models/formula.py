# app/models/formula.py
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


class Formula(Base):
    """
    physics_formulas table

    Stores physics formulas with:
    - name (e.g., "Gauss's Law")
    - expression (e.g., "∮ E · dA = Q_enclosed / ε0")
    - description
    - topic_id (link to physics_topics)
    - difficulty (e.g., "beginner", "intermediate", "advanced")
    """
    __tablename__ = "physics_formulas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    expression = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)

    topic_id = Column(Integer, ForeignKey("physics_topics.id", ondelete="SET NULL"), nullable=True)
    difficulty = Column(String(50), nullable=True)

    created_at = Column(
        DateTime(timezone=False),
        nullable=False,
        default=datetime.utcnow,
    )

    topic = relationship("Topic", back_populates="formulas")

    def __repr__(self) -> str:
        return f"<Formula id={self.id} name={self.name!r} topic_id={self.topic_id}>"
