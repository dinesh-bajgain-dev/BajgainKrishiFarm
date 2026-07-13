"""Import hub so Alembic autogenerate sees every model via Base.metadata."""

from app.db.base_class import Base  # noqa: F401
from app.models.admin_user import AdminUser  # noqa: F401
from app.models.album import Album  # noqa: F401
from app.models.farm_info import FarmInfo  # noqa: F401
from app.models.gallery_image import GalleryImage  # noqa: F401
from app.models.highlight import Highlight  # noqa: F401
from app.models.inquiry import Inquiry  # noqa: F401
from app.models.page_content import AboutPage, HomePage, PageBanners  # noqa: F401
from app.models.pig import Pig  # noqa: F401
