# app/services/auth_service.py
from datetime import timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services import user_service


class UserAlreadyExistsError(Exception):
    """Raised when trying to register a user with an existing email."""


def register_user(db: Session, payload: RegisterRequest) -> TokenResponse:
    """
    Register a new user.

    Steps:
    - Check if email already exists
    - Hash the password
    - Create User row
    - Issue JWT token
    - Return TokenResponse
    """
    existing = user_service.get_user_by_email(db, email=payload.email)
    if existing:
        raise UserAlreadyExistsError("A user with this email already exists")

    hashed_pw = get_password_hash(payload.password)
    user = user_service.create_user(
        db=db,
        name=payload.name,
        email=payload.email,
        password_hash=hashed_pw,
        role="user",
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=user.id, expires_delta=access_token_expires)

    user_read = UserRead.model_validate(user)
    return TokenResponse(access_token=token, user=user_read)


def authenticate_user(db: Session, payload: LoginRequest) -> Optional[TokenResponse]:
    """
    Authenticate a user by email + password.

    Returns:
    - TokenResponse if success
    - None if invalid credentials
    """
    user = user_service.get_user_by_email(db, email=payload.email)
    if not user:
        return None

    if not verify_password(payload.password, user.password_hash):
        return None

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=user.id, expires_delta=access_token_expires)

    user_read = UserRead.model_validate(user)
    return TokenResponse(access_token=token, user=user_read)
