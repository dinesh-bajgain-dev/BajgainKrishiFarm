import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_db
from app.core.limiter import limiter
from app.models.admin_user import AdminUser
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryRead, InquiryStatusUpdate

router = APIRouter()


@router.post("/", response_model=InquiryRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def create_inquiry(
    request: Request, payload: InquiryCreate, db: Session = Depends(get_db)
) -> Inquiry:
    inquiry = Inquiry(**payload.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("/", response_model=list[InquiryRead])
def list_inquiries(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> list[Inquiry]:
    return db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()


@router.get("/{inquiry_id}", response_model=InquiryRead)
def get_inquiry(
    inquiry_id: uuid.UUID,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Inquiry:
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return inquiry


@router.patch("/{inquiry_id}", response_model=InquiryRead)
def update_inquiry_status(
    inquiry_id: uuid.UUID,
    payload: InquiryStatusUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Inquiry:
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    inquiry.status = payload.status
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry
