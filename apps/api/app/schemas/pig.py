from datetime import date

from app.models.pig import ListingType, PigGender, PigStatus
from app.schemas.common import ORMBase, TimestampedRead


class PigBase(ORMBase):
    name_en: str
    name_ne: str = ""
    listing_type: ListingType
    breed_en: str
    breed_ne: str = ""
    gender: PigGender
    date_of_birth: date | None = None
    price: float | None = None
    status: PigStatus = PigStatus.available
    description_en: str = ""
    description_ne: str = ""
    image_urls: list[str] = []
    order: int = 0


class PigCreate(PigBase):
    pass


class PigUpdate(ORMBase):
    name_en: str | None = None
    name_ne: str | None = None
    listing_type: ListingType | None = None
    breed_en: str | None = None
    breed_ne: str | None = None
    gender: PigGender | None = None
    date_of_birth: date | None = None
    price: float | None = None
    status: PigStatus | None = None
    description_en: str | None = None
    description_ne: str | None = None
    image_urls: list[str] | None = None
    order: int | None = None


class PigRead(PigBase, TimestampedRead):
    pass
