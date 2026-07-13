from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, OrderedMixin, TimestampMixin, UUIDPKMixin


class Highlight(UUIDPKMixin, TimestampMixin, OrderedMixin, Base):
    """Featured cards shown on the homepage (e.g. 'Healthy piglets')."""

    __tablename__ = "highlights"

    icon: Mapped[str] = mapped_column(String, default="piggy-bank")
    title_en: Mapped[str] = mapped_column(String)
    title_ne: Mapped[str] = mapped_column(String, default="")
    description_en: Mapped[str] = mapped_column(Text)
    description_ne: Mapped[str] = mapped_column(Text, default="")
