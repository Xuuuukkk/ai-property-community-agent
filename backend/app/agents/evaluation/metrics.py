"""Evaluation metrics for Agent and RAG assessment."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class IntentMetrics:
    """Intent classification evaluation results."""

    total: int = 0
    correct: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    @property
    def accuracy(self) -> float:
        if self.total == 0:
            return 0.0
        return self.correct / self.total

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "correct": self.correct,
            "accuracy": round(self.accuracy, 4),
            "details": self.details,
        }


@dataclass
class ToolMetrics:
    """Tool selection and parameter extraction results."""

    total: int = 0
    tool_correct: int = 0
    param_correct_count: int = 0
    param_total_count: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    @property
    def tool_accuracy(self) -> float:
        if self.total == 0:
            return 0.0
        return self.tool_correct / self.total

    @property
    def parameter_accuracy(self) -> float:
        if self.param_total_count == 0:
            return 0.0
        return self.param_correct_count / self.param_total_count

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "tool_accuracy": round(self.tool_accuracy, 4),
            "parameter_accuracy": round(self.parameter_accuracy, 4),
            "details": self.details,
        }


@dataclass
class WorkflowMetrics:
    """End-to-end workflow success results."""

    total: int = 0
    success: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    @property
    def success_rate(self) -> float:
        if self.total == 0:
            return 0.0
        return self.success / self.total

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "success": self.success,
            "success_rate": round(self.success_rate, 4),
            "details": self.details,
        }


@dataclass
class RAGMetrics:
    """RAG retrieval and answer quality results."""

    total: int = 0
    recall_at_1: int = 0
    recall_at_5: int = 0
    reciprocal_rank_sum: float = 0.0
    keyword_hits: int = 0
    answer_correct: int = 0
    answer_evaluated: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    @property
    def recall_at_1_rate(self) -> float:
        if self.total == 0:
            return 0.0
        return self.recall_at_1 / self.total

    @property
    def recall_at_5_rate(self) -> float:
        if self.total == 0:
            return 0.0
        return self.recall_at_5 / self.total

    @property
    def mrr(self) -> float:
        if self.total == 0:
            return 0.0
        return self.reciprocal_rank_sum / self.total

    @property
    def keyword_accuracy(self) -> float:
        if self.total == 0:
            return 0.0
        return self.keyword_hits / self.total

    @property
    def answer_accuracy(self) -> float:
        if self.answer_evaluated == 0:
            return 0.0
        return self.answer_correct / self.answer_evaluated

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "recall_at_1": round(self.recall_at_1_rate, 4),
            "recall_at_5": round(self.recall_at_5_rate, 4),
            "mrr": round(self.mrr, 4),
            "keyword_accuracy": round(self.keyword_accuracy, 4),
            "answer_accuracy": round(self.answer_accuracy, 4),
            "details": self.details,
        }


@dataclass
class AnswerMetrics:
    """Overall answer-level metrics (placeholder for LLM-judge integration)."""

    total: int = 0
    faithful: int = 0
    details: list[dict[str, Any]] = field(default_factory=list)

    @property
    def faithfulness(self) -> float:
        if self.total == 0:
            return 0.0
        return self.faithful / self.total

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "faithfulness": round(self.faithfulness, 4),
            "details": self.details,
        }


@dataclass
class EvaluationReport:
    """Aggregated evaluation report."""

    intent: IntentMetrics = field(default_factory=IntentMetrics)
    tool: ToolMetrics = field(default_factory=ToolMetrics)
    workflow: WorkflowMetrics = field(default_factory=WorkflowMetrics)
    rag: RAGMetrics = field(default_factory=RAGMetrics)
    answer: AnswerMetrics = field(default_factory=AnswerMetrics)

    def to_dict(self) -> dict[str, Any]:
        return {
            "intent": self.intent.to_dict(),
            "tool": self.tool.to_dict(),
            "workflow": self.workflow.to_dict(),
            "rag": self.rag.to_dict(),
            "answer": self.answer.to_dict(),
        }
