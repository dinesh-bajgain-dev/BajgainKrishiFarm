import uuid

from sqlalchemy import ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, ImageMixin, OrderedMixin, TimestampMixin, UUIDPKMixin


class GalleryImage(UUIDPKMixin, TimestampMixin, ImageMixin, OrderedMixin, Base):
    __tablename__ = "gallery_images"

    album_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("albums.id", ondelete="SET NULL"), nullable=True
    )
    caption_en: Mapped[str | None] = mapped_column(Text, nullable=True)
    caption_ne: Mapped[str | None] = mapped_column(Text, nullable=True)
