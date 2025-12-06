# app/models/topic.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class Topic(Base):
    """
    physics_topics table

    Hierarchical representation of physics topics.
    Example:
    - Mechanics
      - Kinematics
      - Dynamics
    - Electromagnetism
      - Electrostatics
      - Magnetostatics
    """
    __tablename__ = "physics_topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    parent_id = Column(Integer, ForeignKey("physics_topics.id"), nullable=True)

    # Self-referential relationship
    parent = relationship("Topic", remote_side=[id], backref="children")

    formulas = relationship(
        "Formula",
        back_populates="topic",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Topic id={self.id} name={self.name!r}>"
