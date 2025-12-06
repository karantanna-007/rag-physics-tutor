# app/core/dependencies.py
from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import SessionLocal
from app.models.user import User

# OAuth2 scheme for reading the Authorization: Bearer <token> header
oauth2_scheme = OAuth2PasswordBearer(
  tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_db() -> Generator[Session, None, None]:
  """
  Dependency that provides a transactional SQLAlchemy Session.
  """
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()


def get_current_user(
  db: Session = Depends(get_db),
  token: str = Depends(oauth2_scheme),
) -> User:
  """
  Dependency that returns the currently authenticated user based on the JWT token.
  Raises 401 if token is invalid or user not found.
  """
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )

  try:
    token_data = decode_access_token(token)
  except JWTError:
    raise credentials_exception

  if token_data.user_id is None:
    raise credentials_exception

  user = db.query(User).filter(User.id == token_data.user_id).first()
  if user is None:
    raise credentials_exception

  return user


def get_current_active_user(
  current_user: User = Depends(get_current_user),
) -> User:
  """
  If you later add 'is_active' flag on the User model, you can enforce it here.
  Right now, this just returns current_user.
  """
  # Example (future):
  # if not current_user.is_active:
  #     raise HTTPException(status_code=400, detail="Inactive user")
  return current_user
