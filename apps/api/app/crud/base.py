import uuid
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType], order_by: str = "order"):
        self.model = model
        self.order_by = order_by

    def get(self, db: Session, id: uuid.UUID) -> ModelType | None:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(
        self, db: Session, filters: dict[str, Any] | None = None
    ) -> list[ModelType]:
        query = db.query(self.model)
        if filters:
            for field, value in filters.items():
                if value is not None:
                    query = query.filter(getattr(self.model, field) == value)
        if hasattr(self.model, self.order_by):
            query = query.order_by(getattr(self.model, self.order_by))
        return query.all()

    def create(self, db: Session, obj_in: CreateSchemaType) -> ModelType:
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        for field, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, db_obj: ModelType) -> None:
        db.delete(db_obj)
        db.commit()
