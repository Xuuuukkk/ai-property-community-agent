"""Application configuration via pydantic-settings.

Values are read from environment variables (and a local ``.env`` file).
The ``.env`` file is searched in the repository root first, then in the
``backend/`` directory, so the same configuration works for both Docker and
local development workflows.

Note: there is intentionally NO ``VECTOR_DB_URL`` — vector retrieval is
handled by pgvector inside PostgreSQL (see technical-design V2.1 §13).
"""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _find_env_file() -> Path | None:
    """Return the first existing ``.env`` file: repo root, then backend dir."""
    candidates = [
        # Repository root (used by docker compose and most local runs).
        Path(__file__).resolve().parents[3] / ".env",
        # Backend directory fallback.
        Path(__file__).resolve().parents[1] / ".env",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_find_env_file() or ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ---- Application ----
    APP_NAME: str = "AI Property Community Agent"
    APP_ENV: str = "local"
    API_PREFIX: str = "/api"
    LOG_LEVEL: str = "INFO"

    # ---- Security ----
    # Used for signed tokens / session cookies when authentication is enabled.
    SECRET_KEY: str = "change-me-in-production"

    # ---- CORS ----
    # Comma-separated list of origins allowed to call the API.
    # In production this should be the frontend's public URL.
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # ---- Frontend ----
    # Public URL where the frontend is served; used for absolute links / redirects.
    FRONTEND_URL: str = "http://localhost:3000"

    # ---- Database (PostgreSQL 16 + pgvector) ----
    DATABASE_URL: str = (
        "postgresql+psycopg2://admin:password@localhost:5432/property_agent"
    )

    # ---- Cache ----
    REDIS_URL: str = "redis://localhost:6379/0"

    # ---- AI / LLM (used from Phase 5/6 onward) ----
    # Provider base URL; defaults to OpenAI. Use a compatible endpoint if needed.
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    LLM_API_KEY: str = ""
    # Embedding model name. Empty string uses the default sentence-transformers
    # model; "deterministic" is a test-only fallback with no semantic meaning.
    EMBEDDING_MODEL: str = ""
    HF_TOKEN: str = ""  # Optional HuggingFace token for gated models.

    @property
    def cors_origins(self) -> list[str]:
        """Parse BACKEND_CORS_ORIGINS into a list of trimmed strings."""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor (dependency-injection friendly)."""
    return Settings()
