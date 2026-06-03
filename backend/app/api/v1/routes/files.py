import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.file import File as FileModel
from app.schemas.file import FileResponse
from app.core.minio_client import upload_to_minio, download_from_minio, get_presigned_url
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=FileResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    object_name = f"{current_user.id}/{uuid.uuid4()}-{file.filename}"
    data = await file.read()
    
    success = upload_to_minio(settings.MINIO_BUCKET_NAME, object_name, data, file.content_type)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to upload file to MinIO")
    
    file_record = FileModel(
        filename=file.filename,
        object_name=object_name,
        content_type=file.content_type,
        owner_id=current_user.id
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)
    return file_record

@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    data = download_from_minio(settings.MINIO_BUCKET_NAME, file_record.object_name)
    if not data:
        raise HTTPException(status_code=404, detail="File object not found in MinIO")
    
    from io import BytesIO
    return StreamingResponse(BytesIO(data), media_type=file_record.content_type, headers={"Content-Disposition": f'attachment; filename="{file_record.filename}"'})

@router.get("/{file_id}/url")
def get_file_url(
    file_id: int,
    db: Session = Depends(deps.get_db)
) -> Any:
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    url = get_presigned_url(settings.MINIO_BUCKET_NAME, file_record.object_name)
    return {"url": url}

@router.get("/", response_model=list[FileResponse])
def list_files(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    files = db.query(FileModel).filter(FileModel.owner_id == current_user.id).all()
    return files

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    if file_record.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db.delete(file_record)
    db.commit()
    return {"message": "File deleted successfully"}
    
