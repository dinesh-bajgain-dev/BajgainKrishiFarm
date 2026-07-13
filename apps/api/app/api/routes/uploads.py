from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from app.core.deps import get_current_admin
from app.core.storage import save_upload
from app.models.admin_user import AdminUser
from app.schemas.upload import UploadResponse

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
ALLOWED_CONTENT_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES

MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8MB
MAX_VIDEO_BYTES = 50 * 1024 * 1024  # 50MB — enough for a short, compressed looping clip


@router.post("/", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile,
    _admin: AdminUser = Depends(get_current_admin),
) -> UploadResponse:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type"
        )

    is_video = file.content_type in ALLOWED_VIDEO_TYPES
    max_bytes = MAX_VIDEO_BYTES if is_video else MAX_IMAGE_BYTES

    contents = await file.read()
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File too large"
        )

    extension = Path(file.filename or "").suffix
    url = save_upload(contents, extension, file.content_type)
    return UploadResponse(url=url)
