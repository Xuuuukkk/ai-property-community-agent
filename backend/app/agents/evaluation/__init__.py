"""Agent evaluation toolkit.

Loads evaluation datasets from ``evaluation/`` and computes metrics for:

- Intent classification accuracy
- Tool selection and parameter extraction accuracy
- Workflow success rate
- RAG retrieval quality (Recall@K, MRR)
- Answer faithfulness / keyword accuracy
"""

from __future__ import annotations

from app.agents.evaluation.datasets import load_evaluation_datasets
from app.agents.evaluation.metrics import (
    AnswerMetrics,
    EvaluationReport,
    IntentMetrics,
    RAGMetrics,
    ToolMetrics,
    WorkflowMetrics,
)
from app.agents.evaluation.runner import AgentEvaluator

__all__ = [
    "AgentEvaluator",
    "AnswerMetrics",
    "EvaluationReport",
    "IntentMetrics",
    "RAGMetrics",
    "ToolMetrics",
    "WorkflowMetrics",
    "load_evaluation_datasets",
]
