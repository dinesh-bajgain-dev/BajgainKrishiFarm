from app.api.router_factory import build_crud_router
from app.models.highlight import Highlight
from app.schemas.highlight import HighlightCreate, HighlightRead, HighlightUpdate

router = build_crud_router(
    model=Highlight,
    create_schema=HighlightCreate,
    update_schema=HighlightUpdate,
    read_schema=HighlightRead,
)
