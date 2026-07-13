import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.deps import get_db
from app.core.limiter import limiter
from app.core.security import hash_password
from app.db.base import Base
from app.main import app
from app.models.admin_user import AdminUser

test_engine = create_engine(settings.test_database_url)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def _reset_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    limiter.reset()
    yield


def _override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture
def db():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client():
    # base_url must be https:// so the test client's cookie jar re-sends the
    # Secure-flagged session cookie on later requests, matching real browser
    # behavior in production (and on http://localhost, which browsers treat
    # as a secure context as a special case).
    return TestClient(app, base_url="https://testserver")


@pytest.fixture
def admin_credentials():
    return {"email": "admin@test.com", "password": "testpass123"}


@pytest.fixture
def admin_client(client, db, admin_credentials):
    db.add(
        AdminUser(
            email=admin_credentials["email"],
            hashed_password=hash_password(admin_credentials["password"]),
        )
    )
    db.commit()
    response = client.post("/api/auth/login", json=admin_credentials)
    assert response.status_code == 200
    return client
