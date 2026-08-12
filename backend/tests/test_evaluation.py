"""Tests for the Phase 6 Agent Evaluation framework.

These tests verify that evaluation datasets can be loaded and that metrics are
computed correctly. They run against the configured database (the same DB used
by the agent graph) because the agent's business operations use SessionLocal.
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from sqlalchemy.orm import Session

from app.agents.evaluation.datasets import load_evaluation_datasets
from app.agents.evaluation.runner import (
    AgentEvaluator,
    evaluate_intents,
    evaluate_rag,
    evaluate_tools,
    evaluate_workflows,
)
from app.core.database import SessionLocal
from app.models.knowledge import KnowledgeChunk
from app.services.knowledge_indexer import index_documents

REPO_ROOT = Path(__file__).resolve().parents[3]


@pytest.fixture(scope="session", autouse=True)
def _ensure_knowledge_indexed() -> None:
    """Ensure the dev database has knowledge chunks before RAG evaluation tests."""
    os.environ.setdefault("EMBEDDING_MODEL", "deterministic")
    db = SessionLocal()
    try:
        count = db.query(KnowledgeChunk).count()
        if count == 0:
            knowledge_dir = REPO_ROOT / "knowledge-base"
            index_documents(db, knowledge_dir, repo_root=REPO_ROOT, clear_existing=True)
    finally:
        db.close()


class TestEvaluationDatasets:
    """Sanity checks for evaluation dataset files."""

    def test_datasets_load(self) -> None:
        datasets = load_evaluation_datasets()
        assert "intent" in datasets
        assert "tool" in datasets
        assert "workflow" in datasets
        assert "rag" in datasets
        assert len(datasets["intent"]) > 0


class TestIntentEvaluation:
    """Tests for intent classification metrics."""

    def test_intent_accuracy_computed(self) -> None:
        datasets = load_evaluation_datasets()
        metrics = evaluate_intents(datasets["intent"])
        assert metrics.total == len(datasets["intent"])
        assert 0.0 <= metrics.accuracy <= 1.0


class TestToolEvaluation:
    """Tests for tool selection and parameter extraction metrics."""

    def test_tool_metrics_with_db(self, db: Session) -> None:
        datasets = load_evaluation_datasets()
        metrics = evaluate_tools(datasets["tool"], db)
        assert metrics.total == len(datasets["tool"])
        assert 0.0 <= metrics.tool_accuracy <= 1.0
        assert 0.0 <= metrics.parameter_accuracy <= 1.0


class TestWorkflowEvaluation:
    """Tests for end-to-end workflow success metrics."""

    def test_workflow_success_rate(self, db: Session) -> None:
        datasets = load_evaluation_datasets()
        metrics = evaluate_workflows(datasets["workflow"], db)
        assert metrics.total == len(datasets["workflow"])
        assert 0.0 <= metrics.success_rate <= 1.0


class TestRAGEvaluation:
    """Tests for RAG retrieval and answer metrics."""

    def test_rag_metrics_with_indexed_knowledge(self, db: Session) -> None:
        datasets = load_evaluation_datasets()
        metrics = evaluate_rag(datasets["rag"], db)
        assert metrics.total == len(datasets["rag"])
        assert 0.0 <= metrics.recall_at_5_rate <= 1.0
        assert 0.0 <= metrics.mrr <= 1.0


class TestAgentEvaluator:
    """End-to-end tests for the high-level evaluator."""

    def test_evaluator_run(self, db: Session) -> None:
        evaluator = AgentEvaluator(db)
        report = evaluator.run()
        assert report.intent.total > 0
        assert report.tool.total > 0
        assert report.workflow.total > 0
        assert report.rag.total > 0
