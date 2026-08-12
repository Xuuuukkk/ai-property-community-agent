"""Render evaluation reports to JSON and HTML."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.agents.evaluation.metrics import EvaluationReport


TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI Agent Evaluation Report</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 2rem; background: #f8f9fa; color: #212529; }}
    h1 {{ margin-bottom: 0.5rem; }}
    .summary {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0; }}
    .card {{ background: #fff; border-radius: 8px; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }}
    .card h3 {{ margin: 0 0 0.5rem; font-size: 0.9rem; color: #6c757d; }}
    .value {{ font-size: 1.8rem; font-weight: 700; }}
    .pass {{ color: #198754; }}
    .fail {{ color: #dc3545; }}
    table {{ width: 100%; border-collapse: collapse; background: #fff; margin-top: 1rem; }}
    th, td {{ text-align: left; padding: 0.6rem; border-bottom: 1px solid #dee2e6; font-size: 0.9rem; }}
    th {{ background: #e9ecef; }}
    pre {{ white-space: pre-wrap; word-break: break-word; margin: 0; }}
    details {{ margin: 1rem 0; }}
    summary {{ cursor: pointer; font-weight: 600; }}
  </style>
</head>
<body>
  <h1>AI Agent Evaluation Report</h1>
  <p>Generated at {generated_at}</p>
  <div class="summary">
    <div class="card">
      <h3>Intent Accuracy</h3>
      <div class="value {intent_class}">{intent_accuracy:.1%}</div>
    </div>
    <div class="card">
      <h3>Tool Selection Accuracy</h3>
      <div class="value {tool_class}">{tool_accuracy:.1%}</div>
    </div>
    <div class="card">
      <h3>Parameter Accuracy</h3>
      <div class="value {param_class}">{param_accuracy:.1%}</div>
    </div>
    <div class="card">
      <h3>Workflow Success</h3>
      <div class="value {workflow_class}">{workflow_success:.1%}</div>
    </div>
    <div class="card">
      <h3>RAG Recall@5</h3>
      <div class="value {rag_class}">{rag_recall_at_5:.1%}</div>
    </div>
    <div class="card">
      <h3>RAG MRR</h3>
      <div class="value">{rag_mrr:.3f}</div>
    </div>
  </div>

  <details open>
    <summary>Intent Details</summary>
    {intent_table}
  </details>

  <details>
    <summary>Tool Details</summary>
    {tool_table}
  </details>

  <details>
    <summary>Workflow Details</summary>
    {workflow_table}
  </details>

  <details>
    <summary>RAG Details</summary>
    {rag_table}
  </details>
</body>
</html>
"""


def _class_for(value: float, threshold: float = 0.85) -> str:
    return "pass" if value >= threshold else "fail"


def _render_table(headers: list[str], rows: list[list[Any]]) -> str:
    header_html = "".join(f"<th>{h}</th>" for h in headers)
    body_html = ""
    for row in rows:
        body_html += "<tr>" + "".join(f"<td><pre>{cell}</pre></td>" for cell in row) + "</tr>"
    return f"<table><thead><tr>{header_html}</tr></thead><tbody>{body_html}</tbody></table>"


def _intent_table(intent: dict[str, Any]) -> str:
    headers = ["ID", "Text", "Expected", "Predicted", "Correct"]
    rows = []
    for d in intent.get("details", []):
        rows.append(
            [d["id"], d["text"], d["expected"], d["predicted"], "✅" if d["correct"] else "❌"]
        )
    return _render_table(headers, rows)


def _tool_table(tool: dict[str, Any]) -> str:
    headers = ["ID", "Text", "Expected Tool", "Actual Tool", "Params"]
    rows = []
    for d in tool.get("details", []):
        params = json.dumps(d.get("parameter_checks", []), ensure_ascii=False, indent=2)
        rows.append(
            [
                d["id"],
                d["text"],
                d["expected_tool"],
                d["actual_tool"],
                params,
            ]
        )
    return _render_table(headers, rows)


def _workflow_table(workflow: dict[str, Any]) -> str:
    headers = ["ID", "Text", "Expected Tool", "Actual Tool", "Success", "Response"]
    rows = []
    for d in workflow.get("details", []):
        rows.append(
            [
                d["id"],
                d["text"],
                d["expected_tool"],
                d["actual_tool"],
                "✅" if d["success"] else "❌",
                d["response"],
            ]
        )
    return _render_table(headers, rows)


def _rag_table(rag: dict[str, Any]) -> str:
    headers = ["ID", "Question", "Expected Source", "Rank", "Keywords", "Answer Correct"]
    rows = []
    for d in rag.get("details", []):
        rows.append(
            [
                d["id"],
                d["question"],
                d["expected_source"],
                d["rank"] if d["rank"] else "-",
                "✅" if d["keyword_hit"] else "❌",
                "✅" if d["answer_correct"] else ("❌" if d["answer_correct"] is False else "-"),
            ]
        )
    return _render_table(headers, rows)


def render_html(report: EvaluationReport, generated_at: str) -> str:
    """Render an HTML report from an evaluation report."""
    data = report.to_dict()
    intent_acc = data["intent"]["accuracy"]
    tool_acc = data["tool"]["tool_accuracy"]
    param_acc = data["tool"]["parameter_accuracy"]
    workflow_success = data["workflow"]["success_rate"]
    rag_recall_at_5 = data["rag"]["recall_at_5"]
    rag_mrr = data["rag"]["mrr"]

    return TEMPLATE.format(
        generated_at=generated_at,
        intent_accuracy=intent_acc,
        intent_class=_class_for(intent_acc, 0.95),
        tool_accuracy=tool_acc,
        tool_class=_class_for(tool_acc, 0.95),
        param_accuracy=param_acc,
        param_class=_class_for(param_acc, 0.85),
        workflow_success=workflow_success,
        workflow_class=_class_for(workflow_success, 0.90),
        rag_recall_at_5=rag_recall_at_5,
        rag_class=_class_for(rag_recall_at_5, 0.90),
        rag_mrr=rag_mrr,
        intent_table=_intent_table(data["intent"]),
        tool_table=_tool_table(data["tool"]),
        workflow_table=_workflow_table(data["workflow"]),
        rag_table=_rag_table(data["rag"]),
    )


def write_report(report: EvaluationReport, output_dir: Path) -> tuple[Path, Path]:
    """Write JSON and HTML reports to ``output_dir`` and return both paths."""
    output_dir.mkdir(parents=True, exist_ok=True)
    data = report.to_dict()

    json_path = output_dir / "evaluation-report.json"
    json_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    from datetime import datetime, timezone

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    html_path = output_dir / "evaluation-report.html"
    html_path.write_text(render_html(report, generated_at), encoding="utf-8")

    return json_path, html_path
