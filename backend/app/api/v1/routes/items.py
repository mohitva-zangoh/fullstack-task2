from typing import Any, List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.item import ItemCreate, ItemResponse
from app.services.item import ItemService

router = APIRouter()


@router.get("/", response_model=List[ItemResponse])
def get_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
) -> Any:
    return ItemService.get_items(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
    )


@router.post("/", response_model=ItemResponse)
def create_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: ItemCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return ItemService.create_item(
        db=db,
        item_in=item_in,
        current_user=current_user,
    )


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    return ItemService.get_item(
        db=db,
        item_id=item_id,
    )


@router.delete("/{item_id}", response_model=ItemResponse)
def delete_item(
    item_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return ItemService.delete_item(
        db=db,
        item_id=item_id,
        current_user=current_user,
    )