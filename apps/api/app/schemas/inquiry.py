import uuid

from app.models.inquiry import InquiryStatus, PreferredContactMethod
from app.schemas.common import ORMBase, TimestampedRead


class InquiryCreate(ORMBase):
    name: str
    phone: str
    email: str
    pig_id: uuid.UUID | None = None
    interest: str | None = None
    quantity: str | None = None
    preferred_contact_method: PreferredContactMethod = PreferredContactMethod.phone
    message: str


class InquiryStatusUpdate(ORMBase):
    status: InquiryStatus


class InquiryRead(TimestampedRead):
    name: str
    phone: str
    email: str
    pig_id: uuid.UUID | None = None
    interest: str | None = None
    quantity: str | None = None
    preferred_contact_method: PreferredContactMethod
    message: str
    status: InquiryStatus
