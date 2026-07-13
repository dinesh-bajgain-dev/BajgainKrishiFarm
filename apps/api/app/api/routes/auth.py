from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.deps import SESSION_COOKIE_NAME, get_current_admin, get_db
from app.core.security import create_access_token, verify_password
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminMeResponse, LoginRequest

router = APIRouter()


@router.post("/login", response_model=AdminMeResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> AdminMeResponse:
    admin = db.query(AdminUser).filter(AdminUser.email == payload.email).first()
    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=admin.email)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        # Safe in local dev too: browsers treat http://localhost as a secure
        # context, so a Secure cookie still gets set and sent there.
        secure=True,
        max_age=60 * 60 * 24,
        path="/",
    )
    return AdminMeResponse(email=admin.email)


@router.post("/logout")
def logout(response: Response) -> dict[str, str]:
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")
    return {"status": "logged_out"}


@router.get("/me", response_model=AdminMeResponse)
def me(admin: AdminUser = Depends(get_current_admin)) -> AdminMeResponse:
    return AdminMeResponse(email=admin.email)
