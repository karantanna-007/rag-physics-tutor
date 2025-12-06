# app/services/user_service.py
from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session,
    name: str,
    email: str,
    password_hash: str,
    role: str = "user",
) -> User:
    user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_users(db: Session) -> List[User]:
    """
    Optional helper: list all users (might be used for admin later).
    """
    return db.query(User).order_by(User.created_at.desc()).all()
