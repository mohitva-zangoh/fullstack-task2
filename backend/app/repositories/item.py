from typing import Optional
from sqlalchemy.orm import Session

from app.models.item import Item


class ItemRepository:

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
    ):
        query = db.query(Item)

        if search:
            query = query.filter(
                Item.title.ilike(f"%{search}%")
                | Item.description.ilike(f"%{search}%")
            )

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, item_id: int):
        return db.query(Item).filter(Item.id == item_id).first()

    @staticmethod
    def create(db: Session, item_data: dict):
        item = Item(**item_data)

        db.add(item)
        db.commit()
        db.refresh(item)

        return item

    @staticmethod
    def delete(db: Session, item: Item):
        db.delete(item)
        db.commit()

        return item