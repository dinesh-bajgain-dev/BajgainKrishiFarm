from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.limiter import limiter

app = FastAPI(title="Bajgain Krishi Farm API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local dev only: serve uploaded files straight from disk. In production
# (R2 configured) photos are served from R2's own URL instead, and this
# directory doesn't need to exist — serverless filesystems are read-only.
if not settings.r2_bucket_name:
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


from app.api.routes import (  # noqa: E402
    about_page,
    admin_dashboard,
    albums,
    auth,
    farm_info,
    gallery,
    highlights,
    home_page,
    inquiries,
    page_banners,
    pigs,
    uploads,
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(pigs.router, prefix="/api/pigs", tags=["pigs"])
app.include_router(albums.router, prefix="/api/albums", tags=["albums"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["gallery"])
app.include_router(highlights.router, prefix="/api/highlights", tags=["highlights"])
app.include_router(farm_info.router, prefix="/api/farm-info", tags=["farm-info"])
app.include_router(home_page.router, prefix="/api/home-page", tags=["home-page"])
app.include_router(about_page.router, prefix="/api/about-page", tags=["about-page"])
app.include_router(page_banners.router, prefix="/api/page-banners", tags=["page-banners"])
app.include_router(inquiries.router, prefix="/api/inquiries", tags=["inquiries"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(admin_dashboard.router, prefix="/api/admin", tags=["admin"])
