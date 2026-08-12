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

    Falls back to the deterministic provider if the configured sentence-
    transformer model cannot be loaded (e.g. no network access or a corrupted
    local cache).  This keeps the RAG plumbing functional, but semantic search
    quality will be poor until a real model is available.
    """
    import warnings

    settings = get_settings()
    model_name = settings.EMBEDDING_MODEL.strip()

    if model_name.lower() == "deterministic":
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
