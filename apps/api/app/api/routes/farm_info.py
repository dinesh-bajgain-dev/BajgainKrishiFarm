from app.api.router_factory import build_singleton_router
from app.models.farm_info import FarmInfo
from app.schemas.farm_info import FarmInfoRead, FarmInfoUpdate

router = build_singleton_router(
    model=FarmInfo,
    read_schema=FarmInfoRead,
    update_schema=FarmInfoUpdate,
    not_found_detail="Farm info not set",
)
