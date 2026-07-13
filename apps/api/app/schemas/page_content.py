from app.schemas.common import ORMBase, TimestampedRead


class HomePageBase(ORMBase):
    hero_title_en: str
    hero_title_ne: str = ""
    hero_subtitle_en: str
    hero_subtitle_ne: str = ""
    hero_image_url: str | None = None
    hero_video_url: str | None = None


class HomePageUpdate(ORMBase):
    hero_title_en: str | None = None
    hero_title_ne: str | None = None
    hero_subtitle_en: str | None = None
    hero_subtitle_ne: str | None = None
    hero_image_url: str | None = None
    hero_video_url: str | None = None


class HomePageRead(HomePageBase, TimestampedRead):
    pass


class AboutPageBase(ORMBase):
    story_en: str
    story_ne: str = ""
    practices_en: str
    practices_ne: str = ""
    owner_name: str
    owner_message_en: str
    owner_message_ne: str = ""
    owner_photo_url: str | None = None
    farm_photo_url: str | None = None


class AboutPageUpdate(ORMBase):
    story_en: str | None = None
    story_ne: str | None = None
    practices_en: str | None = None
    practices_ne: str | None = None
    owner_name: str | None = None
    owner_message_en: str | None = None
    owner_message_ne: str | None = None
    owner_photo_url: str | None = None
    farm_photo_url: str | None = None


class AboutPageRead(AboutPageBase, TimestampedRead):
    pass


class PageBannersBase(ORMBase):
    about_banner_url: str | None = None
    piglets_banner_url: str | None = None
    breeding_banner_url: str | None = None
    gallery_banner_url: str | None = None
    location_banner_url: str | None = None
    contact_banner_url: str | None = None


class PageBannersUpdate(PageBannersBase):
    pass


class PageBannersRead(PageBannersBase, TimestampedRead):
    pass
