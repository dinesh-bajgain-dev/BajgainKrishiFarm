import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_db
from app.crud.base import CRUDBase
from app.db.base_class import Base
from app.models.admin_user import AdminUser


def build_singleton_router(
    *,
    model: type[Base],
    read_schema: type[BaseModel],
    update_schema: type[BaseModel],
    not_found_detail: str = "Content not set",
) -> APIRouter:
    """Builds a public GET + admin-only PUT router for a one-row settings table."""

    router = APIRouter()

    @router.get("/", response_model=read_schema)
    def get_singleton(db: Session = Depends(get_db)) -> Any:
        obj = db.query(model).first()
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found_detail)
        return obj

    @router.put("/", response_model=read_schema)
    def update_singleton(
        payload: update_schema,
        db: Session = Depends(get_db),
        _admin: AdminUser = Depends(get_current_admin),
    ) -> Any:
        obj = db.query(model).first()
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found_detail)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(obj, field, value)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    return router


def build_crud_router(
    *,
    model: type[Base],
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    read_schema: type[BaseModel],
    filter_fields: list[str] | None = None,
) -> APIRouter:
    """Builds public GET (list/detail) + admin-only POST/PUT/DELETE routes for a model."""

    router = APIRouter()
    crud = CRUDBase(model)
    filter_fields = filter_fields or []

    if filter_fields:
        filter_field = filter_fields[0]

        @router.get("/", response_model=list[read_schema])
        def list_items(
            db: Session = Depends(get_db),
            filter_value: str | None = Query(default=None, alias=filter_field),
        ) -> Any:
            filters = {filter_field: filter_value} if filter_value else None
            return crud.get_multi(db, filters=filters)
    else:

        @router.get("/", response_model=list[read_schema])
        def list_items(db: Session = Depends(get_db)) -> Any:
            return crud.get_multi(db)

    @router.get("/{item_id}", response_model=read_schema)
    def get_item(item_id: uuid.UUID, db: Session = Depends(get_db)) -> Any:
        obj = crud.get(db, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        return obj

    @router.post("/", response_model=read_schema, status_code=status.HTTP_201_CREATED)
    def create_item(
        item_in: create_schema,
        db: Session = Depends(get_db),
        _admin: AdminUser = Depends(get_current_admin),
    ) -> Any:
        return crud.create(db, item_in)

    @router.put("/{item_id}", response_model=read_schema)
    def update_item(
        item_id: uuid.UUID,
        item_in: update_schema,
        db: Session = Depends(get_db),
        _admin: AdminUser = Depends(get_current_admin),
    ) -> Any:
        obj = crud.get(db, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        return crud.update(db, obj, item_in)

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(
        item_id: uuid.UUID,
        db: Session = Depends(get_db),
        _admin: AdminUser = Depends(get_current_admin),
    ) -> None:
        obj = crud.get(db, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        crud.remove(db, obj)

    return router
