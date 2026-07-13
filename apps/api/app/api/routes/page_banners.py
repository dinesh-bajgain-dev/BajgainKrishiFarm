from app.api.router_factory import build_singleton_router
from app.models.page_content import PageBanners
from app.schemas.page_content import PageBannersRead, PageBannersUpdate

router = build_singleton_router(
    model=PageBanners,
    read_schema=PageBannersRead,
    update_schema=PageBannersUpdate,
    not_found_detail="Page banners not set",
)
