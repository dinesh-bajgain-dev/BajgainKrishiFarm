from app.api.router_factory import build_singleton_router
from app.models.page_content import AboutPage
from app.schemas.page_content import AboutPageRead, AboutPageUpdate

router = build_singleton_router(
    model=AboutPage,
    read_schema=AboutPageRead,
    update_schema=AboutPageUpdate,
    not_found_detail="About page content not set",
)
