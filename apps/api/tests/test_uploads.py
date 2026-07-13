import io
from pathlib import Path

from app.core.config import settings


def _fake_image_bytes() -> bytes:
    # Minimal valid 1x1 PNG
    return bytes.fromhex(
        "89504e470d0a1a0a0000000d49484452000000010000000108020000009077"
        "53de000000097048597300000ec300000ec301c76fa8640000000c49444154"
        "789c6360606060000000050001a5f645400000000049454e44ae426082"
    )


def test_upload_requires_auth(client):
    files = {"file": ("test.png", io.BytesIO(_fake_image_bytes()), "image/png")}
    response = client.post("/api/uploads/", files=files)
    assert response.status_code == 401


def test_upload_success(admin_client):
    files = {"file": ("test.png", io.BytesIO(_fake_image_bytes()), "image/png")}
    response = admin_client.post("/api/uploads/", files=files)
    assert response.status_code == 201
    url = response.json()["url"]
    assert url.startswith("/uploads/")

    saved_path = Path(settings.upload_dir) / url.split("/uploads/")[1]
    assert saved_path.exists()
    saved_path.unlink()


def test_upload_rejects_bad_content_type(admin_client):
    files = {"file": ("test.txt", io.BytesIO(b"not an image"), "text/plain")}
    response = admin_client.post("/api/uploads/", files=files)
    assert response.status_code == 400


def test_upload_accepts_video(admin_client):
    files = {"file": ("test.mp4", io.BytesIO(b"fake mp4 bytes"), "video/mp4")}
    response = admin_client.post("/api/uploads/", files=files)
    assert response.status_code == 201
    url = response.json()["url"]
    assert url.startswith("/uploads/")

    saved_path = Path(settings.upload_dir) / url.split("/uploads/")[1]
    assert saved_path.exists()
    saved_path.unlink()


def test_upload_rejects_oversized_video(admin_client):
    oversized = b"0" * (50 * 1024 * 1024 + 1)
    files = {"file": ("test.mp4", io.BytesIO(oversized), "video/mp4")}
    response = admin_client.post("/api/uploads/", files=files)
    assert response.status_code == 400
