import uuid

from app.schemas.common import ORMBase, TimestampedRead


class GalleryImageBase(ORMBase):
    album_id: uuid.UUID | None = None
    caption_en: str | None = None
    caption_ne: str | None = None
    image_url: str | None = None
    order: int = 0


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(ORMBase):
    album_id: uuid.UUID | None = None
    caption_en: str | None = None
    caption_ne: str | None = None
    image_url: str | None = None
    order: int | None = None


class GalleryImageRead(GalleryImageBase, TimestampedRead):
    pass
