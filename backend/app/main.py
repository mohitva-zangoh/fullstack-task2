from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.minio_client import create_bucket, upload_to_minio, download_from_minio
from app.db.base import Base
from app.db.session import engine

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(  
    title="My Backend"
)

@app.on_event("startup")
async def startup_event():
    create_bucket(settings.MINIO_BUCKET_NAME)
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api/v1"
)

@app.get("/")
def health():
    return {"status": "ok"}
