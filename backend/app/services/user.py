from datetime import timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, LoginRequest


class AuthService:

    @staticmethod
    def register(db: Session, user_in: UserCreate):

        existing_user = UserRepository.get_by_email(
            db,
            user_in.email,
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )

        return UserRepository.create(
            db=db,
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
        )

    @staticmethod
    def login(db: Session, payload: LoginRequest):

        user = UserRepository.get_by_email(
            db,
            payload.email,
        )

        if not user or not verify_password(
            payload.password,
            user.hashed_password,
        ):
            raise HTTPException(
                status_code=400,
                detail="Incorrect email or password",
            )

        access_token = create_access_token(
            subject=user.id,
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            ),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }