"""Application configuration via pydantic-settings.

Values are read from environment variables (and a local ``.env`` file).
Note: there is intentionally NO ``VECTOR_DB_URL`` — vector retrieval is
handled by pgvector inside PostgreSQL (see technical-design V2.1 §13).
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "AI Property Community Agent"
    APP_ENV: str = "local"
    API_PREFIX: str = "/api"

    # Database (PostgreSQL 16 + pgvector)
    DATABASE_URL: str = (
        "postgresql+psycopg2://admin:password@localhost:5432/property_agent"
    )

    # Cache
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI (used from Phase 5/6 onward)
    LLM_API_KEY: str = ""
    EMBEDDING_MODEL: str = ""


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor (dependency-injection friendly)."""
    return Settings()
