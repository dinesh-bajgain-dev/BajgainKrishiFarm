from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Small pool on purpose: in production this runs as a serverless function, so
# a fresh instance can spin up per request. A big pool per instance would
# quickly exhaust the database's connection limit. Pair with a pooled
# connection string (e.g. Neon's "-pooler" host) in production.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=1,
    max_overflow=2,
    pool_recycle=300,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
