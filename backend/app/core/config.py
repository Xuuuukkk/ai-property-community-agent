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

from pydantic import model_validator
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
    # This default is deliberately weak: it keeps local dev and tests working
    # out of the box, but production startup (see the validator below) rejects
    # it. Always set a strong random value in production, e.g.:
    #   python -c "import secrets; print(secrets.token_urlsafe(32))"
    SECRET_KEY: str = "change-me-in-production-please-generate-a-32-byte-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

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
    # Provider base URL; defaults to Zhipu OpenAI-compatible endpoint.
    # Use OpenAI (https://api.openai.com/v1) or any compatible service if needed.
    OPENAI_API_BASE: str = "https://open.bigmodel.cn/api/paas/v4/"
    LLM_API_KEY: str = ""
    # Chat completion model. Must be supported by the provider above.
    LLM_MODEL: str = "glm-4-flash"
    # Embedding model name.
    # - "embedding-3" / "embedding-2" -> Zhipu OpenAI-compatible embeddings (1024-d).
    # - "deterministic" -> test-only fallback with no semantic meaning (384-d).
    # - empty / other -> sentence-transformers model name.
    EMBEDDING_MODEL: str = ""
    # Embedding dimension. Must match the chosen EMBEDDING_MODEL.
    EMBEDDING_DIMENSION: int = 1024
    HF_TOKEN: str = ""  # Optional HuggingFace token for gated models.

    # ---- Vision (automated patrol inspection) ----
    # Multimodal model used to analyze patrol screenshots (Zhipu GLM-4V family).
    VISION_MODEL: str = "glm-4v-plus"

    @property
    def cors_origins(self) -> list[str]:
        """Parse BACKEND_CORS_ORIGINS into a list of trimmed strings."""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode="after")
    def _reject_insecure_production_secrets(self) -> "Settings":
        """Refuse to boot in production with an insecure SECRET_KEY.

        The default/placeholder key is fine for local dev and tests, but a
        production deployment must supply a strong random key. Failing early
        here is safer than silently signing JWTs with a publicly-known secret.
        """
        insecure_keys = {
            "change-me-in-production-please-generate-a-32-byte-key",
            "dev-only-insecure-key",
        }
        if self.APP_ENV == "production" and (
            not self.SECRET_KEY
            or self.SECRET_KEY in insecure_keys
            or len(self.SECRET_KEY) < 32
        ):
            raise ValueError(
                "SECRET_KEY must be set to a strong random value (>=32 chars) "
                "in production. Generate one with: "
                "python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        return self


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor (dependency-injection friendly)."""
    return Settings()
