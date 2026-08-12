#!/usr/bin/env python3
"""CLI script to index the Markdown knowledge base into pgvector.

Usage:
    python -m scripts.index_knowledge_base
    python -m scripts.index_knowledge_base --repo-root /path/to/repo
    python -m scripts.index_knowledge_base --embedding-model deterministic
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

# Allow imports from backend/app when running from repo root or backend/.
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.core.embeddings import (
    EmbeddingProvider,
    _DeterministicProvider,
    get_embedding_provider,
)
from app.services.knowledge_indexer import index_documents


def main() -> int:
    parser = argparse.ArgumentParser(description="Index knowledge-base Markdown files into pgvector.")
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=None,
        help="Repository root (defaults to the parent of the backend directory).",
    )
    parser.add_argument(
        "--knowledge-dir",
        type=Path,
        default=None,
        help="Knowledge base directory (defaults to <repo-root>/knowledge-base).",
    )
    parser.add_argument(
        "--embedding-model",
        type=str,
        default=os.getenv("EMBEDDING_MODEL", ""),
        help="Embedding model name; use 'deterministic' for testing.",
    )
    args = parser.parse_args()

    # Build the embedding provider explicitly before any cached settings are
    # resolved.  This avoids depending on environment variable timing when
    # ``app.core.database`` imports ``get_settings`` at module load time.
    provider: EmbeddingProvider
    if args.embedding_model:
        if args.embedding_model.lower() == "deterministic":
            provider = _DeterministicProvider()
        else:
            from app.core.embeddings import _SentenceTransformerProvider

            provider = _SentenceTransformerProvider(args.embedding_model)
    else:
        provider = get_embedding_provider()

    settings = get_settings()
    print(f"Database: {settings.DATABASE_URL.replace(settings.DATABASE_URL.split(':')[2].split('@')[0], '***')}")
    print(f"Embedding model: {args.embedding_model or settings.EMBEDDING_MODEL or 'all-MiniLM-L6-v2 (default)'}")

    repo_root = args.repo_root or BACKEND_DIR.parent
    knowledge_dir = args.knowledge_dir or repo_root / "knowledge-base"

    if not knowledge_dir.is_dir():
        print(f"Knowledge directory not found: {knowledge_dir}", file=sys.stderr)
        return 1

    db = SessionLocal()
    try:
        stats = index_documents(
            db, knowledge_dir, repo_root=repo_root, provider=provider
        )
        print(f"Indexed {stats['documents']} documents, {stats['chunks']} chunks.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    sys.exit(main())
