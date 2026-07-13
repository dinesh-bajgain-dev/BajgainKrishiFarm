from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDPKMixin


class FarmInfo(UUIDPKMixin, TimestampMixin, Base):
    """Singleton settings table — application logic ensures exactly one row exists.

    Bilingual columns come in *_en / *_ne pairs; the frontend falls back to
    English when the Nepali value is empty.
    """

    __tablename__ = "farm_info"

    farm_name_en: Mapped[str] = mapped_column(String)
    farm_name_ne: Mapped[str] = mapped_column(String, default="")
    description_en: Mapped[str] = mapped_column(Text)
    description_ne: Mapped[str] = mapped_column(Text, default="")
    phone: Mapped[str] = mapped_column(String)
    whatsapp: Mapped[str | None] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String)
    address_en: Mapped[str] = mapped_column(String)
    address_ne: Mapped[str] = mapped_column(String, default="")
    hours_en: Mapped[str] = mapped_column(Text)
    hours_ne: Mapped[str] = mapped_column(Text, default="")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    google_maps_embed_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    facebook_url: Mapped[str | None] = mapped_column(String, nullable=True)
    instagram_url: Mapped[str | None] = mapped_column(String, nullable=True)
    youtube_url: Mapped[str | None] = mapped_column(String, nullable=True)
    tiktok_url: Mapped[str | None] = mapped_column(String, nullable=True)
    established_year: Mapped[int] = mapped_column(Integer, default=2023)
