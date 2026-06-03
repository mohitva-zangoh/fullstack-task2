from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.item import ItemCreate
from app.repositories.item import ItemRepository


class ItemService:

    @staticmethod
    def get_items(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
    ):
        return ItemRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
        )

    @staticmethod
    def create_item(
        db: Session,
        item_in: ItemCreate,
        current_user: User,
    ):
        return ItemRepository.create(
            db,
            {
                "title": item_in.title,
                "description": item_in.description,
                "image_url": item_in.image_url,
                "owner_id": current_user.id,
            },
        )

    @staticmethod
    def get_item(db: Session, item_id: int):
        item = ItemRepository.get_by_id(db, item_id)

        if not item:
            raise HTTPException(
                status_code=404,
                detail="Item not found",
            )

        return item

    @staticmethod
    def delete_item(
        db: Session,
        item_id: int,
        current_user: User,
    ):
        item = ItemRepository.get_by_id(db, item_id)

        if not item:
            raise HTTPException(
                status_code=404,
                detail="Item not found",
            )

        if item.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions",
            )

        return ItemRepository.delete(db, item)