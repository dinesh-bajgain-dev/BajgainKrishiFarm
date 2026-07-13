import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDPKMixin


class PreferredContactMethod(str, enum.Enum):
    phone = "phone"
    email = "email"
    whatsapp = "whatsapp"


class InquiryStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    closed = "closed"


class Inquiry(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "inquiries"

    name: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    pig_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pigs.id", ondelete="SET NULL"), nullable=True
    )
    # Free-text snapshot of what the visitor asked about (kept even if the pig
    # listing is later deleted).
    interest: Mapped[str | None] = mapped_column(String, nullable=True)
    quantity: Mapped[str | None] = mapped_column(String, nullable=True)
    preferred_contact_method: Mapped[PreferredContactMethod] = mapped_column(
        Enum(PreferredContactMethod, name="preferred_contact_method"),
        default=PreferredContactMethod.phone,
    )
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[InquiryStatus] = mapped_column(
        Enum(InquiryStatus, name="inquiry_status"), default=InquiryStatus.new
    )
