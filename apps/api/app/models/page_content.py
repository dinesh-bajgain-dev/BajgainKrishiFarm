from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDPKMixin


class HomePage(UUIDPKMixin, TimestampMixin, Base):
    """Singleton — editable hero content for the homepage."""

    __tablename__ = "home_page"

    hero_title_en: Mapped[str] = mapped_column(String)
    hero_title_ne: Mapped[str] = mapped_column(String, default="")
    hero_subtitle_en: Mapped[str] = mapped_column(Text)
    hero_subtitle_ne: Mapped[str] = mapped_column(Text, default="")
    hero_image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    hero_video_url: Mapped[str | None] = mapped_column(String, nullable=True)


class AboutPage(UUIDPKMixin, TimestampMixin, Base):
    """Singleton — editable content for the About page."""

    __tablename__ = "about_page"

    story_en: Mapped[str] = mapped_column(Text)
    story_ne: Mapped[str] = mapped_column(Text, default="")
    practices_en: Mapped[str] = mapped_column(Text)
    practices_ne: Mapped[str] = mapped_column(Text, default="")
    owner_name: Mapped[str] = mapped_column(String)
    owner_message_en: Mapped[str] = mapped_column(Text)
    owner_message_ne: Mapped[str] = mapped_column(Text, default="")
    owner_photo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    farm_photo_url: Mapped[str | None] = mapped_column(String, nullable=True)


class PageBanners(UUIDPKMixin, TimestampMixin, Base):
    """Singleton — the decorative banner photo shown at the top of each secondary page."""

    __tablename__ = "page_banners"

    about_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
    piglets_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
    breeding_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
    gallery_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
    location_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
    contact_banner_url: Mapped[str | None] = mapped_column(String, nullable=True)
