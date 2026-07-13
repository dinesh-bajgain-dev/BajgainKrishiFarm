from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.album import Album
from app.models.gallery_image import GalleryImage
from app.models.highlight import Highlight
from app.models.inquiry import Inquiry, InquiryStatus
from app.models.pig import ListingType, Pig, PigStatus
from app.schemas.dashboard import DashboardSummary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def summary(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> DashboardSummary:
    def available_count(listing_type: ListingType) -> int:
        return (
            db.query(Pig)
            .filter(Pig.listing_type == listing_type, Pig.status == PigStatus.available)
            .count()
        )

    return DashboardSummary(
        pigs=db.query(Pig).count(),
        available_piglets=available_count(ListingType.piglet),
        available_breeding_pigs=available_count(ListingType.breeding),
        gallery_images=db.query(GalleryImage).count(),
        albums=db.query(Album).count(),
        highlights=db.query(Highlight).count(),
        inquiries=db.query(Inquiry).count(),
        new_inquiries=db.query(Inquiry).filter(Inquiry.status == InquiryStatus.new).count(),
    )
