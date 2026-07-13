from app.schemas.common import ORMBase, TimestampedRead


class HighlightBase(ORMBase):
    icon: str = "piggy-bank"
    title_en: str
    title_ne: str = ""
    description_en: str
    description_ne: str = ""
    order: int = 0


class HighlightCreate(HighlightBase):
    pass


class HighlightUpdate(ORMBase):
    icon: str | None = None
    title_en: str | None = None
    title_ne: str | None = None
    description_en: str | None = None
    description_ne: str | None = None
    order: int | None = None


class HighlightRead(HighlightBase, TimestampedRead):
    pass
