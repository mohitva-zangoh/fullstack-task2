from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
