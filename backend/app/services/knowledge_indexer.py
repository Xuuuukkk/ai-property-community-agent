"""Knowledge base indexing service.

Loads Markdown files from ``knowledge-base/``, splits them into semantically
coherent chunks, computes embeddings, and persists everything into PostgreSQL
via pgvector.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.core.embeddings import EmbeddingProvider, get_embedding_provider
from app.models.knowledge import EMBEDDING_DIMENSION, KnowledgeChunk, KnowledgeDocument


@dataclass
class _Chunk:
    index: int
    heading: str
    content: str
    metadata: dict[str, Any]


@dataclass
class _ParsedDocument:
    title: str
    source_path: str
    category: str
    metadata: dict[str, Any]
    chunks: list[_Chunk]


def _extract_title(text: str) -> str:
    """Return the first level-1 heading or a fallback title."""
    match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "未命名文档"


def _split_by_headings(text: str) -> list[tuple[str, str]]:
    """Split Markdown into (heading, body) sections based on H2/H3 headings."""
    # Normalize line endings.
    text = text.replace("\r\n", "\n")
    # Find lines starting with ## or ###.
    pattern = re.compile(r"^(#{2,3})\s+(.+)$", re.MULTILINE)
    matches = list(pattern.finditer(text))

    if not matches:
        # No sub-headings: treat the whole document (minus the title) as one chunk.
        body = re.sub(r"^#\s+.+\n?", "", text, count=1, flags=re.MULTILINE).strip()
        return [("", body)]

    sections: list[tuple[str, str]] = []

    # Text before the first heading becomes the intro chunk (empty heading).
    first_start = matches[0].start()
    intro = text[:first_start].strip()
    if intro:
        intro = re.sub(r"^#\s+.+\n?", "", intro, count=1, flags=re.MULTILINE).strip()
        if intro:
            sections.append(("", intro))

    for i, match in enumerate(matches):
        heading = match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        sections.append((heading, body))

    return sections


def _clean_markdown(text: str) -> str:
    """Light Markdown cleaning for better embedding quality."""
    # Remove blockquotes markers used for callouts.
    text = re.sub(r"^>\s?", "", text, flags=re.MULTILINE)
    # Collapse multiple blank lines.
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_markdown_file(file_path: Path, repo_root: Path) -> _ParsedDocument:
    """Parse a single Markdown file into a structured document."""
    raw = file_path.read_text(encoding="utf-8")
    cleaned = _clean_markdown(raw)

    title = _extract_title(cleaned)
    category = file_path.parent.name
    relative_path = str(file_path.relative_to(repo_root)).replace("\\", "/")

    sections = _split_by_headings(cleaned)

    chunks: list[_Chunk] = []
    for idx, (heading, body) in enumerate(sections):
        if heading:
            chunk_text = f"{heading}\n{body}"
        else:
            chunk_text = body
        if not chunk_text.strip():
            continue
        chunks.append(
            _Chunk(
                index=idx,
                heading=heading,
                content=chunk_text,
                metadata={"heading": heading},
            )
        )

    return _ParsedDocument(
        title=title,
        source_path=relative_path,
        category=category,
        metadata={
            "filename": file_path.name,
            "extension": file_path.suffix,
        },
        chunks=chunks,
    )


def collect_markdown_files(knowledge_dir: Path) -> list[Path]:
    """Return all *.md files under the knowledge base directory."""
    if not knowledge_dir.is_dir():
        return []
    return sorted(p for p in knowledge_dir.rglob("*.md") if p.is_file())


def index_documents(
    db: Session,
    knowledge_dir: Path,
    *,
    repo_root: Path | None = None,
    provider: EmbeddingProvider | None = None,
    clear_existing: bool = True,
) -> dict[str, int]:
    """Index all Markdown documents under ``knowledge_dir``.

    Args:
        db: SQLAlchemy session.
        knowledge_dir: Root directory containing the Markdown knowledge base.
        repo_root: Repository root used to compute relative source paths.
        provider: Embedding provider.  Defaults to ``get_embedding_provider()``.
        clear_existing: If True, deletes existing documents/chunks before indexing.

    Returns:
        Summary counters: {"documents": int, "chunks": int}
    """
    if repo_root is None:
        repo_root = knowledge_dir
    if provider is None:
        provider = get_embedding_provider()

    if provider.dimension != EMBEDDING_DIMENSION:
        raise ValueError(
            f"Embedding dimension mismatch: model={provider.dimension}, "
            f"database={EMBEDDING_DIMENSION}"
        )

    if clear_existing:
        db.query(KnowledgeChunk).delete(synchronize_session=False)
        db.query(KnowledgeDocument).delete(synchronize_session=False)
        db.flush()

    files = collect_markdown_files(knowledge_dir)
    doc_count = 0
    chunk_count = 0

    for file_path in files:
        parsed = parse_markdown_file(file_path, repo_root)
        if not parsed.chunks:
            continue

        document = KnowledgeDocument(
            title=parsed.title,
            source_path=parsed.source_path,
            category=parsed.category,
            doc_metadata=parsed.metadata,
        )
        db.add(document)
        db.flush()  # obtain document.id

        texts = [chunk.content for chunk in parsed.chunks]
        embeddings = provider.embed_documents(texts)

        for chunk, embedding in zip(parsed.chunks, embeddings):
            db.add(
                KnowledgeChunk(
                    document_id=document.id,
                    chunk_index=chunk.index,
                    content=chunk.content,
                    embedding=embedding,
                    chunk_metadata=chunk.metadata,
                )
            )
            chunk_count += 1

        doc_count += 1

    db.commit()
    return {"documents": doc_count, "chunks": chunk_count}
