"""LLM provider configuration.

The application uses an OpenAI-compatible chat completion endpoint. When no
API key is configured, ``get_llm()`` returns ``None`` so callers can fall back
to deterministic rule-based behavior.
"""

from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING

from app.core.config import get_settings

if TYPE_CHECKING:
    from langchain_openai import ChatOpenAI


@lru_cache
def get_llm() -> "ChatOpenAI | None":
    """Return a cached ChatOpenAI instance if an API key is configured.

    The model name, base URL and key are read from application settings. If
    ``LLM_API_KEY`` is empty, the system operates in rule-based fallback mode.
    """
    settings = get_settings()
    if not settings.LLM_API_KEY:
        return None

    # Import here so the module loads cleanly when no API key is configured.
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.LLM_API_KEY,
        base_url=settings.OPENAI_API_BASE,
        temperature=0.2,
        max_retries=2,
    )


def is_llm_available() -> bool:
    """Return True when a configured LLM client can be created."""
    return get_llm() is not None
