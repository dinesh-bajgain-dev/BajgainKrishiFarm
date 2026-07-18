def test_login_success(client, db, admin_credentials):
    from app.core.security import hash_password
    from app.models.admin_user import AdminUser

    db.add(
        AdminUser(
            email=admin_credentials["email"],
            hashed_password=hash_password(admin_credentials["password"]),
        )
    )
    db.commit()

    response = client.post("/api/auth/login", json=admin_credentials)
    assert response.status_code == 200
    assert response.json()["email"] == admin_credentials["email"]
    assert "admin_session" in response.cookies


def test_login_wrong_password(client, db, admin_credentials):
    from app.core.security import hash_password
    from app.models.admin_user import AdminUser

    db.add(
        AdminUser(
            email=admin_credentials["email"],
            hashed_password=hash_password(admin_credentials["password"]),
        )
    )
    db.commit()

    response = client.post(
        "/api/auth/login",
        json={"email": admin_credentials["email"], "password": "wrong"},
    )
    assert response.status_code == 401


def test_me_requires_auth(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_me_and_logout(admin_client, admin_credentials):
    response = admin_client.get("/api/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == admin_credentials["email"]

    logout_response = admin_client.post("/api/auth/logout")
    assert logout_response.status_code == 200

    me_after_logout = admin_client.get("/api/auth/me")
    assert me_after_logout.status_code == 401


def test_seed_updates_existing_admin_password(db, monkeypatch):
    from app.core.config import settings
    from app.core.security import hash_password, verify_password
    from app.models.admin_user import AdminUser
    from app.seed.seed_data import seed_admin_user

    db.add(
        AdminUser(
            email=settings.admin_email,
            hashed_password=hash_password("oldpass123"),
        )
    )
    db.commit()

    monkeypatch.setattr(settings, "admin_password", "@12*Din&Baz.", raising=False)
    seed_admin_user(db)

    admin = db.query(AdminUser).filter(AdminUser.email == settings.admin_email).first()
    assert admin is not None
    assert verify_password(settings.admin_password, admin.hashed_password)


def test_seed_replaces_stale_admin_account(db, monkeypatch):
    from app.core.config import settings
    from app.core.security import hash_password, verify_password
    from app.models.admin_user import AdminUser
    from app.seed.seed_data import seed_admin_user

    db.add(
        AdminUser(
            email="admin@bajgainfarm.com",
            hashed_password=hash_password("oldpass123"),
        )
    )
    db.commit()

    monkeypatch.setattr(settings, "admin_email", "dinesh.bazgain@gmail.com", raising=False)
    monkeypatch.setattr(settings, "admin_password", "@12*Din&Baz.", raising=False)
    seed_admin_user(db)

    admins = db.query(AdminUser).all()
    assert len(admins) == 1
    assert admins[0].email == settings.admin_email
    assert verify_password(settings.admin_password, admins[0].hashed_password)
