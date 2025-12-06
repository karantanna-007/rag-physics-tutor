# app/core/security.py
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from app.core.config import settings

# Password hashing configuration
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")



def verify_password(plain_password: str, hashed_password: str) -> bool:
  """
  Verify a plain password against a hashed password.
  """
  return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
  """
  Hash a password for storing in the database.
  """
  return pwd_context.hash(password)


class TokenData(BaseModel):
  """
  Data extracted from the JWT token payload.
  Here we keep it minimal: just the user_id (sub).
  """
  user_id: Optional[int] = None


def create_access_token(
  subject: str | int,
  expires_delta: Optional[timedelta] = None,
) -> str:
  """
  Create a JWT access token.

  - subject: usually the user ID
  - expires_delta: custom expiry; if None, uses ACCESS_TOKEN_EXPIRE_MINUTES
  """
  if expires_delta is not None:
    expire = datetime.utcnow() + expires_delta
  else:
    expire = datetime.utcnow() + timedelta(
      minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

  to_encode = {
    "exp": expire,
    "sub": str(subject),
  }

  encoded_jwt = jwt.encode(
    to_encode,
    settings.JWT_SECRET_KEY,
    algorithm=settings.JWT_ALGORITHM,
  )
  return encoded_jwt


def decode_access_token(token: str) -> TokenData:
  """
  Decode a JWT access token and return TokenData.
  Raises JWTError if invalid/expired.
  """
  try:
    payload = jwt.decode(
      token,
      settings.JWT_SECRET_KEY,
      algorithms=[settings.JWT_ALGORITHM],
    )
    subject = payload.get("sub")
    if subject is None:
      raise JWTError("Token missing 'sub' claim")

    return TokenData(user_id=int(subject))
  except JWTError as e:
    # Let the caller decide how to handle the error
    raise e
