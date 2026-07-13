import uuid
from pathlib import Path

from app.core.config import settings


def _r2_client():
    import boto3

    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name="auto",
    )


def save_upload(contents: bytes, extension: str, content_type: str) -> str:
    """Saves an uploaded file and returns the public URL to serve it from.

    Uses Cloudflare R2 when configured (production, serverless — no local
    disk to write to). Falls back to the local `uploads/` folder otherwise
    (local development).
    """
    filename = f"{uuid.uuid4()}{extension}"

    if settings.r2_bucket_name:
        _r2_client().put_object(
            Bucket=settings.r2_bucket_name,
            Key=filename,
            Body=contents,
            ContentType=content_type,
        )
        return f"{settings.r2_public_url.rstrip('/')}/{filename}"

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(contents)
    return f"/uploads/{filename}"
