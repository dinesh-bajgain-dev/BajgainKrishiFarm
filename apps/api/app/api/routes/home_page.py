from app.api.router_factory import build_singleton_router
from app.models.page_content import HomePage
from app.schemas.page_content import HomePageRead, HomePageUpdate

router = build_singleton_router(
    model=HomePage,
    read_schema=HomePageRead,
    update_schema=HomePageUpdate,
    not_found_detail="Homepage content not set",
)
