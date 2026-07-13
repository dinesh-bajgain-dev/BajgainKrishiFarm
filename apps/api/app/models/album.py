from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, OrderedMixin, TimestampMixin, UUIDPKMixin


class Album(UUIDPKMixin, TimestampMixin, OrderedMixin, Base):
    __tablename__ = "albums"

    title_en: Mapped[str] = mapped_column(String)
    title_ne: Mapped[str] = mapped_column(String, default="")
