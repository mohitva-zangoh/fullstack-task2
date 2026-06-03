import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fullstack Task 2"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    SQLALCHEMY_DATABASE_URI: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_SECRET_KEY")
    MINIO_SECURE: bool = os.getenv("MINIO_SECURE", "False").lower() in ("true", "1", "t")
    MINIO_BUCKET_NAME: str = os.getenv("MINIO_BUCKET_NAME")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        case_sensitive = True

settings = Settings()
