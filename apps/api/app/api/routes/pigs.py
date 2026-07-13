from app.api.router_factory import build_crud_router
from app.models.pig import Pig
from app.schemas.pig import PigCreate, PigRead, PigUpdate

router = build_crud_router(
    model=Pig,
    create_schema=PigCreate,
    update_schema=PigUpdate,
    read_schema=PigRead,
    filter_fields=["listing_type"],
)
