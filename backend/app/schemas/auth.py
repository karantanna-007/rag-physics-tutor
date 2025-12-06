# app/schemas/auth.py
from pydantic import BaseModel, EmailStr

from app.schemas.user import UserRead


class LoginRequest(BaseModel):
    """
    Request body for /auth/login
    """
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """
    Request body for /auth/register
    """
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """
    Response returned after successful login or registration.
    - access_token: JWT bearer token
    - token_type: usually "bearer"
    - user: basic profile information of the logged-in user
    """
    access_token: str
    token_type: str = "bearer"
    user: UserRead
