"""Embedding provider for the RAG knowledge pipeline.

Defaults to a local ``sentence-transformers`` model so the system works
without an external API key.  ``EMBEDDING_MODEL`` can be set to any model
name understood by ``sentence_transformers.SentenceTransformer``.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings


class EmbeddingProvider(Protocol):
    """Minimal interface for text embedding models."""

    dimension: int

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        ...

    def embed_query(self, text: str) -> list[float]:
        ...


class _SentenceTransformerProvider:
    """Wrapper around sentence-transformers with lazy model loading."""

    dimension = 384  # all-MiniLM-L6-v2 default

    def __init__(self, model_name: str) -> None:
        from sentence_transformers import SentenceTransformer

        self._model = SentenceTransformer(model_name)
        self.dimension = self._model.get_sentence_embedding_dimension()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        embeddings = self._model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        return [emb.tolist() for emb in embeddings]

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


class _OpenAIEmbeddingProvider:
    """OpenAI-compatible embedding provider (e.g. Zhipu embedding-3/embedding-2)."""

    dimension: int

    def __init__(self, model_name: str, api_key: str, base_url: str, dimension: int) -> None:
        from openai import OpenAI

        self._model = model_name
        self._client = OpenAI(api_key=api_key, base_url=base_url)
        self.dimension = dimension
        # Resolve real dimension with a cheap probe call when possible.
        try:
            probe = self._client.embeddings.create(
                model=self._model, input=["test"], dimensions=dimension
            )
            if probe.data and probe.data[0].embedding:
                self.dimension = len(probe.data[0].embedding)
        except Exception:
            # Provider may not support `dimensions`; keep configured dimension.
            pass

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        # OpenAI-compatible endpoints typically support up to 64 inputs per batch.
        batch_size = 64
        embeddings: list[list[float]] = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            response = self._client.embeddings.create(
                model=self._model, input=batch, dimensions=self.dimension
            )
            # Sort by index because API responses are not guaranteed to be ordered.
            batch_embeddings = sorted(
                response.data, key=lambda d: d.index  # type: ignore[arg-type]
            )
            embeddings.extend([d.embedding for d in batch_embeddings])
        return embeddings

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


class _DeterministicProvider:
    """Fallback deterministic embedding for tests and CI environments.

    Produces a fixed-dimension vector based on the input text hash.  It is
    obviously not semantically meaningful, but allows the RAG plumbing to be
    exercised without downloading a transformer model.
    """

    dimension = 384

    def _embed(self, text: str) -> list[float]:
        import hashlib
        import math

        seed = hashlib.sha256(text.encode("utf-8")).digest()
        vector = []
        for i in range(self.dimension):
            # Deterministic pseudo-random values in [-1, 1].
            value = (int.from_bytes(seed[i % len(seed) : i % len(seed) + 4], "big") % 2000 - 1000) / 1000
            vector.append(value)
        # Normalize so cosine similarity behaves predictably.
        norm = math.sqrt(sum(v * v for v in vector)) or 1.0
        return [v / norm for v in vector]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._embed(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._embed(text)


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    """Return a cached embedding provider based on configuration.

    Routing:
    - "deterministic" -> hash-based fallback (no API key, no semantics).
    - "embedding-3" / "embedding-2" -> Zhipu/OpenAI-compatible embeddings.
    - other non-empty value -> sentence-transformers model name.
    - empty -> default sentence-transformers model.

    Falls back to the deterministic provider if the configured provider cannot
    be initialised.
    """
    import warnings

    settings = get_settings()
    model_name = settings.EMBEDDING_MODEL.strip()

    if model_name.lower() == "deterministic":
        return _DeterministicProvider()

    # OpenAI-compatible providers (Zhipu embedding-3 / embedding-2).
    if model_name.lower() in {"embedding-3", "embedding-2"}:
        api_key = settings.LLM_API_KEY
        base_url = settings.OPENAI_API_BASE
        if api_key and base_url:
            try:
                return _OpenAIEmbeddingProvider(
                    model_name=model_name,
                    api_key=api_key,
                    base_url=base_url,
                    dimension=settings.EMBEDDING_DIMENSION,
                )
            except Exception as exc:  # pragma: no cover - network/auth dependent
                warnings.warn(
                    f"Failed to load OpenAI-compatible embedding model {model_name!r}: {exc}. "
                    "Falling back to deterministic embeddings.",
                    stacklevel=2,
                )
        else:
            warnings.warn(
                f"EMBEDDING_MODEL={model_name!r} requires LLM_API_KEY and OPENAI_API_BASE. "
                "Falling back to deterministic embeddings.",
                stacklevel=2,
            )
        return _DeterministicProvider()

    candidate = model_name or "all-MiniLM-L6-v2"
    try:
        return _SentenceTransformerProvider(candidate)
    except Exception as exc:  # pragma: no cover - environment dependent
        warnings.warn(
            f"Failed to load embedding model {candidate!r}: {exc}. "
            "Falling back to deterministic embeddings. "
            "Set EMBEDDING_MODEL=deterministic to silence this warning, "
            "or provide a working sentence-transformers model name.",
            stacklevel=2,
        )
        return _DeterministicProvider()
