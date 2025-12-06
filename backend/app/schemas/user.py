# app/schemas/user.py
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from app.schemas.common import IDModel, TimestampMixin


class UserBase(BaseModel):
    """
    Common fields shared by user-related schemas.
    """
    name: str
    email: EmailStr
    role: str = "user"


class UserCreate(BaseModel):
    """
    Schema for creating a user (registration).
    """
    name: str
    email: EmailStr
    password: str


class UserRead(IDModel, TimestampMixin, BaseModel):
    """
    Schema returned to the client when reading user information.
    """
    name: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)


class UserInDBBase(IDModel, TimestampMixin, BaseModel):
    """
    Base schema for user data stored in the DB.
    Includes password_hash but typically not returned to clients.
    """
    name: str
    email: EmailStr
    role: str
    password_hash: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
