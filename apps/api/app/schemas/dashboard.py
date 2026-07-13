from app.schemas.common import ORMBase


class DashboardSummary(ORMBase):
    pigs: int
    available_piglets: int
    available_breeding_pigs: int
    gallery_images: int
    albums: int
    highlights: int
    inquiries: int
    new_inquiries: int
