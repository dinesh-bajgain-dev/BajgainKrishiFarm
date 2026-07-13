from app.api.router_factory import build_crud_router
from app.models.gallery_image import GalleryImage
from app.schemas.gallery_image import GalleryImageCreate, GalleryImageRead, GalleryImageUpdate

router = build_crud_router(
    model=GalleryImage,
    create_schema=GalleryImageCreate,
    update_schema=GalleryImageUpdate,
    read_schema=GalleryImageRead,
    filter_fields=["album_id"],
)
