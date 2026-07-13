from app.schemas.common import ORMBase, TimestampedRead


class AlbumBase(ORMBase):
    title_en: str
    title_ne: str = ""
    order: int = 0


class AlbumCreate(AlbumBase):
    pass


class AlbumUpdate(ORMBase):
    title_en: str | None = None
    title_ne: str | None = None
    order: int | None = None


class AlbumRead(AlbumBase, TimestampedRead):
    pass
