import enum
from datetime import date

from sqlalchemy import Date, Enum, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, OrderedMixin, TimestampMixin, UUIDPKMixin


class ListingType(str, enum.Enum):
    piglet = "piglet"
    breeding = "breeding"


class PigGender(str, enum.Enum):
    male = "male"
    female = "female"


class PigStatus(str, enum.Enum):
    available = "available"
    reserved = "reserved"
    sold = "sold"


class Pig(UUIDPKMixin, TimestampMixin, OrderedMixin, Base):
    __tablename__ = "pigs"

    name_en: Mapped[str] = mapped_column(String)
    name_ne: Mapped[str] = mapped_column(String, default="")
    listing_type: Mapped[ListingType] = mapped_column(Enum(ListingType, name="listing_type"))
    breed_en: Mapped[str] = mapped_column(String)
    breed_ne: Mapped[str] = mapped_column(String, default="")
    gender: Mapped[PigGender] = mapped_column(Enum(PigGender, name="pig_gender"))
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    status: Mapped[PigStatus] = mapped_column(
        Enum(PigStatus, name="pig_status"), default=PigStatus.available
    )
    description_en: Mapped[str] = mapped_column(Text, default="")
    description_ne: Mapped[str] = mapped_column(Text, default="")
    image_urls: Mapped[list[str]] = mapped_column(JSONB, default=list)
