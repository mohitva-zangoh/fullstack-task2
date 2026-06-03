from pydantic import BaseModel

class FileBase(BaseModel):
    filename: str
    object_name: str
    content_type: str

class FileCreate(FileBase):
    pass

class FileResponse(FileBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
