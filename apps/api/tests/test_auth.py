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


def test_login_sets_cookie_domain(client, db, admin_credentials):
    from app.core.config import settings
    from app.core.security import hash_password
    from app.models.admin_user import AdminUser

    original_domain = settings.cookie_domain
    settings.cookie_domain = "bajgainkrishifarm.com.np"
    try:
        db.add(
            AdminUser(
                email=admin_credentials["email"],
                hashed_password=hash_password(admin_credentials["password"]),
            )
        )
        db.commit()

        response = client.post("/api/auth/login", json=admin_credentials)
        assert response.status_code == 200
        assert "Domain=bajgainkrishifarm.com.np" in response.headers["set-cookie"]
    finally:
        settings.cookie_domain = original_domain


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

