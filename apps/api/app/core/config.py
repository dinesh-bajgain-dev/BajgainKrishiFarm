from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    test_database_url: str = ""
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24
    cors_origins: str = "http://localhost:3000"
    admin_email: str = "admin@bajgainfarm.com"
    admin_password: str = "changeme123"
    upload_dir: str = "uploads"

    # Photo/video storage in production (Cloudflare R2). Left blank in local
    # dev, which falls back to saving files in `upload_dir` on disk instead.
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = ""
    r2_public_url: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
