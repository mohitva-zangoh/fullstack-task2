from typing import Any

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserResponse,
    LoginRequest,
)
from app.services.user import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:

    return AuthService.register(
        db=db,
        user_in=user_in,
    )


@router.post("/login")
def login(
    db: Session = Depends(deps.get_db),
    payload: LoginRequest = Body(...),
) -> Any:

    return AuthService.login(
        db=db,
        payload=payload,
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:

    return current_user