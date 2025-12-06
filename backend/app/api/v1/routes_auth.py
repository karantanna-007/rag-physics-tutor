# app/api/v1/routes_auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services import auth_service

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Register a new user.

    On success:
    - Create the user in the DB
    - Return a JWT access token + basic user profile
    """
    try:
        token_response = auth_service.register_user(db=db, payload=payload)
        return token_response
    except auth_service.UserAlreadyExistsError as e:  # you will define this in service
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Login with email + password.

    On success:
    - Return JWT access token + basic user profile
    """
    token_response = auth_service.authenticate_user(db=db, payload=payload)
    if token_response is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_response


@router.get("/me", response_model=UserRead)
def get_me(current_user=Depends(get_current_user)) -> UserRead:
    """
    Get the current authenticated user's profile.
    """
    # current_user is a SQLAlchemy model instance, Pydantic will convert it
    return current_user
