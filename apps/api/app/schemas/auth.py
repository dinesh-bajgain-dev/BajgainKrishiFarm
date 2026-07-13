from app.schemas.common import ORMBase


class LoginRequest(ORMBase):
    email: str
    password: str


class AdminMeResponse(ORMBase):
    email: str
