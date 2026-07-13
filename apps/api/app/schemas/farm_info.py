import re
from urllib.parse import urlparse

from pydantic import field_validator

from app.schemas.common import ORMBase, TimestampedRead

GOOGLE_MAPS_EMBED_HOSTS = {"google.com", "www.google.com", "maps.google.com"}
GOOGLE_MAPS_EMBED_PATTERN = re.compile(
    r"<iframe\b[^>]*src=[\"'](?P<src>https?://[^\"']+)[\"'][^>]*>",
    re.IGNORECASE,
)


class FarmInfoBase(ORMBase):
    farm_name_en: str
    farm_name_ne: str = ""
    description_en: str
    description_ne: str = ""
    phone: str
    whatsapp: str | None = None
    email: str
    address_en: str
    address_ne: str = ""
    hours_en: str
    hours_ne: str = ""
    latitude: float | None = None
    longitude: float | None = None
    google_maps_embed_code: str | None = None
    facebook_url: str | None = None
    instagram_url: str | None = None
    youtube_url: str | None = None
    tiktok_url: str | None = None
    established_year: int = 2023


class FarmInfoUpdate(ORMBase):
    farm_name_en: str | None = None
    farm_name_ne: str | None = None
    description_en: str | None = None
    description_ne: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    address_en: str | None = None
    address_ne: str | None = None
    hours_en: str | None = None
    hours_ne: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    google_maps_embed_code: str | None = None
    facebook_url: str | None = None
    instagram_url: str | None = None
    youtube_url: str | None = None
    tiktok_url: str | None = None
    established_year: int | None = None

    @field_validator("google_maps_embed_code")
    @classmethod
    def validate_google_maps_embed_code(cls, value: str | None) -> str | None:
        if value is None:
            return None

        trimmed = value.strip()
        if not trimmed:
            return None

        if not trimmed.lower().startswith("<iframe"):
            raise ValueError("Paste a valid Google Maps iframe embed code.")

        match = GOOGLE_MAPS_EMBED_PATTERN.search(trimmed)
        if not match:
            raise ValueError("Paste a valid Google Maps iframe embed code.")

        parsed_src = urlparse(match.group("src"))
        hostname = parsed_src.hostname.lower() if parsed_src.hostname else ""
        path = parsed_src.path.lower()
        query = parsed_src.query.lower()

        if hostname not in GOOGLE_MAPS_EMBED_HOSTS:
            raise ValueError("Only Google Maps iframe embed code is allowed.")

        if "/embed" not in path and "output=embed" not in query:
            raise ValueError("Only Google Maps embed iframes are allowed.")

        return trimmed


class FarmInfoRead(FarmInfoBase, TimestampedRead):
    pass
