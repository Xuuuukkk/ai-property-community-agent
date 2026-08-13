"""Run evaluation datasets against the agent system and compute metrics."""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.agents.evaluation.datasets import load_evaluation_datasets
from app.agents.evaluation.metrics import (
    AnswerMetrics,
    EvaluationReport,
    IntentMetrics,
    RAGMetrics,
    ToolMetrics,
    WorkflowMetrics,
)
from app.agents.graph import run_agent
from app.agents.intent import classify_intent_rule


def _nested_get(data: dict[str, Any], path: str) -> Any:
    """Safely traverse a dotted path in a nested dict."""
    current: Any = data
    for part in path.split("."):
        if not isinstance(current, dict):
            return None
        current = current.get(part)
    return current


def evaluate_intents(cases: list[dict[str, Any]]) -> IntentMetrics:
    """Evaluate intent classification accuracy."""
    metrics = IntentMetrics()
    for case in cases:
        text = case["text"]
        expected = case["expected_intent"]
        predicted = classify_intent_rule(text)
        correct = predicted == expected
        metrics.total += 1
        if correct:
            metrics.correct += 1
        metrics.details.append(
            {
                "id": case.get("id"),
                "text": text,
                "expected": expected,
                "predicted": predicted,
                "correct": correct,
            }
        )
    return metrics


def _match_parameter(actual: Any, expected: Any) -> bool:
    """Check whether an actual parameter satisfies the expected value."""
    if expected == "exists":
        return actual is not None
    if expected == "non_empty":
        return bool(actual)
    return actual == expected


def evaluate_tools(
    cases: list[dict[str, Any]], db: Session
) -> ToolMetrics:
    """Evaluate tool selection and parameter extraction accuracy."""
    metrics = ToolMetrics()
    for case in cases:
        text = case["text"]
        expected_intent = case["expected_intent"]
        expected_tool = case["expected_tool"]
        expected_params = case.get("expected_parameters", {})

        result = run_agent(text, db=db)
        actual_tool = ""
        actual_input: dict[str, Any] = {}
        if result.tool_results:
            first = result.tool_results[0]
            actual_tool = first.get("tool", "")
            actual_input = first.get("input", {})

        tool_correct = actual_tool == expected_tool
        metrics.total += 1
        if tool_correct:
            metrics.tool_correct += 1

        param_hits = 0
        param_checks = []
        for key, expected_value in expected_params.items():
            metrics.param_total_count += 1
            actual_value = actual_input.get(key)
            matched = _match_parameter(actual_value, expected_value)
            if matched:
                param_hits += 1
                metrics.param_correct_count += 1
            param_checks.append(
                {
                    "key": key,
                    "expected": expected_value,
                    "actual": actual_value,
                    "matched": matched,
                }
            )

        metrics.details.append(
            {
                "id": case.get("id"),
                "text": text,
                "expected_intent": expected_intent,
                "predicted_intent": result.intent,
                "expected_tool": expected_tool,
                "actual_tool": actual_tool,
                "tool_correct": tool_correct,
                "parameter_checks": param_checks,
                "parameter_hits": param_hits,
                "parameter_total": len(expected_params),
            }
        )
    return metrics


def _check_workflow_success(tool_result: dict[str, Any], checks: dict[str, Any]) -> bool:
    """Return True if all success checks pass for a tool result."""
    for path, expected in checks.items():
        actual = _nested_get(tool_result, path)
        if expected == "exists":
            if actual is None:
                return False
        elif expected == "non_empty":
            if not actual:
                return False
        elif actual != expected:
            return False
    return True


def evaluate_workflows(
    cases: list[dict[str, Any]], db: Session
) -> WorkflowMetrics:
    """Evaluate end-to-end workflow completion."""
    metrics = WorkflowMetrics()
    for case in cases:
        text = case["text"]
        expected_intent = case["expected_intent"]
        expected_tool = case["expected_tool"]
        checks = case.get("success_checks", {})

        result = run_agent(text, db=db)
        actual_tool = ""
        success = False
        if result.tool_results:
            first = result.tool_results[0]
            actual_tool = first.get("tool", "")
            if actual_tool == expected_tool:
                success = _check_workflow_success(first, checks)

        metrics.total += 1
        if success:
            metrics.success += 1

        metrics.details.append(
            {
                "id": case.get("id"),
                "text": text,
                "expected_intent": expected_intent,
                "predicted_intent": result.intent,
                "expected_tool": expected_tool,
                "actual_tool": actual_tool,
                "success": success,
                "response": result.response,
            }
        )
    return metrics


def evaluate_rag(
    cases: list[dict[str, Any]], db: Session
) -> RAGMetrics:
    """Evaluate RAG retrieval quality and answer accuracy."""
    metrics = RAGMetrics()
    for case in cases:
        question = case["question"]
        expected_source = case["expected_source"]
        expected_keywords = case.get("expected_keywords", [])
        expected_answer = case.get("expected_answer", "")

        result = run_agent(question, db=db)
        results: list[dict[str, Any]] = []
        if result.tool_results:
            first = result.tool_results[0]
            results = first.get("output", {}).get("results", [])

        # Determine rank of expected source.
        rank: int | None = None
        source_hits = []
        for idx, chunk in enumerate(results, start=1):
            source = chunk.get("source_path", "")
            source_hits.append(source)
            if expected_source in source and rank is None:
                rank = idx

        metrics.total += 1
        if rank == 1:
            metrics.recall_at_1 += 1
        if rank is not None and rank <= 5:
            metrics.recall_at_5 += 1
        if rank is not None:
            metrics.reciprocal_rank_sum += 1.0 / rank

        # Keyword faithfulness: expected keywords appear in retrieved content.
        all_content = " ".join(c.get("content", "") for c in results).lower()
        keyword_hit = all(
            kw.lower() in all_content for kw in expected_keywords
        ) if expected_keywords else True
        if keyword_hit:
            metrics.keyword_hits += 1

        # Answer accuracy: expected answer appears in agent response.
        if expected_answer:
            metrics.answer_evaluated += 1
            correct = expected_answer.lower() in result.response.lower()
            if correct:
                metrics.answer_correct += 1
        else:
            correct = None

        metrics.details.append(
            {
                "id": case.get("id"),
                "question": question,
                "expected_source": expected_source,
                "sources": source_hits[:5],
                "rank": rank,
                "keyword_hit": keyword_hit,
                "expected_answer": expected_answer,
                "actual_answer": result.response,
                "answer_correct": correct,
            }
        )
    return metrics


class AgentEvaluator:
    """High-level evaluator that loads datasets and runs all metrics."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.datasets = load_evaluation_datasets()

    def run(self) -> EvaluationReport:
        """Run the full evaluation suite and return a report."""
        report = EvaluationReport()
        report.intent = evaluate_intents(self.datasets["intent"])
        report.tool = evaluate_tools(self.datasets["tool"], self.db)
        report.workflow = evaluate_workflows(self.datasets["workflow"], self.db)
        report.rag = evaluate_rag(self.datasets["rag"], self.db)
        return report
