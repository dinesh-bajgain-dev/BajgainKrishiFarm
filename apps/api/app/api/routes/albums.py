from app.api.router_factory import build_crud_router
from app.models.album import Album
from app.schemas.album import AlbumCreate, AlbumRead, AlbumUpdate

router = build_crud_router(
    model=Album,
    create_schema=AlbumCreate,
    update_schema=AlbumUpdate,
    read_schema=AlbumRead,
)
