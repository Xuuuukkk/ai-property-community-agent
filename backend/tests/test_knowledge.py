"""Tests for the RAG knowledge base system (Phase 6)."""

from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.agents.domain_agents import run_knowledge_agent
from app.agents.state import AgentState
from app.core.embeddings import get_embedding_provider
from app.core.paths import KNOWLEDGE_BASE_DIR as KNOWLEDGE_DIR, REPO_ROOT
from app.models.knowledge import EMBEDDING_DIMENSION, KnowledgeChunk, KnowledgeDocument
from app.services.knowledge import get_index_stats, retrieve_knowledge
from app.services.knowledge_indexer import index_documents


def test_embedding_provider_dimension() -> None:
    provider = get_embedding_provider()
    vector = provider.embed_query("装修时间")
    assert len(vector) == EMBEDDING_DIMENSION


def test_index_creates_documents_and_chunks(db: Session) -> None:
    stats = index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)
    assert stats["documents"] > 0
    assert stats["chunks"] >= stats["documents"]

    doc_count = db.query(KnowledgeDocument).count()
    chunk_count = db.query(KnowledgeChunk).count()
    assert doc_count == stats["documents"]
    assert chunk_count == stats["chunks"]


def test_retrieve_knowledge_returns_results(db: Session) -> None:
    index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)

    result = retrieve_knowledge(db, "装修几点可以施工？", top_k=3)
    assert result["query"] == "装修几点可以施工？"
    assert len(result["results"]) > 0
    assert "message" in result

    # Each result should include expected metadata.
    first = result["results"][0]
    assert "chunk_id" in first
    assert "content" in first
    assert "similarity" in first
    assert "source_path" in first


def test_retrieve_with_category_filter(db: Session) -> None:
    index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)

    decoration_results = retrieve_knowledge(
        db, "装修时间", top_k=5, category="decoration"
    )
    assert all(r["category"] == "decoration" for r in decoration_results["results"])


def test_knowledge_agent_uses_rag(db: Session) -> None:
    index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)

    state: AgentState = {
        "user_id": 1,
        "conversation_id": "test-conv",
        "messages": [],
    }
    state["messages"].append(type("Msg", (), {"content": "装修几点可以施工？"})())

    result = run_knowledge_agent(db, state)
    response = result["response"]
    # The agent must either use RAG phrasing (deterministic fallback) or
    # answer with concrete details drawn from the retrieved chunks.
    assert (
        "根据知识库" in response
        or "相关规定" in response
        or "7点" in response
        or "19点" in response
        or "施工" in response
    )
    assert result["tool_results"]


def test_knowledge_api_search(client: TestClient, db: Session) -> None:
    index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)

    response = client.post("/api/knowledge/search", json={"query": "停车规则", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "停车规则"
    assert len(data["results"]) > 0


def test_knowledge_api_stats(client: TestClient, db: Session) -> None:
    index_documents(db, KNOWLEDGE_DIR, repo_root=REPO_ROOT, clear_existing=True)

    response = client.get("/api/knowledge/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["documents"] > 0
    assert data["chunks"] > 0


def test_knowledge_api_reindex(client: TestClient, db: Session) -> None:
    response = client.post("/api/knowledge/reindex")
    assert response.status_code == 200
    data = response.json()
    assert data["documents"] > 0
    assert data["chunks"] > 0

    stats = get_index_stats(db)
    assert stats["documents"] == data["documents"]
