"""CLI entry point: run the full evaluation suite and write reports.

Usage:
    python -m app.agents.evaluation --output-dir evaluation/output
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from app.agents.evaluation.report import write_report
from app.agents.evaluation.runner import AgentEvaluator
from app.core.database import SessionLocal
from app.core.paths import REPO_ROOT


def _print_summary(report) -> None:
    data = report.to_dict()
    summary = {
        "intent": data["intent"]["accuracy"],
        "tool_selection": data["tool"]["tool_accuracy"],
        "parameter": data["tool"]["parameter_accuracy"],
        "workflow_success": data["workflow"]["success_rate"],
        "rag_recall@5": data["rag"]["recall_at_5"],
        "rag_mrr": data["rag"]["mrr"],
        "rag_answer_accuracy": data["rag"]["answer_accuracy"],
    }
    print("=== 评估结果（准确率基线）===")
    for key, value in summary.items():
        print(f"  {key}: {value:.2%}" if isinstance(value, float) else f"  {key}: {value}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run AI agent evaluation suite")
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(REPO_ROOT / "evaluation" / "output"),
        help="Directory to write JSON/HTML reports",
    )
    args = parser.parse_args()

    db = SessionLocal()
    try:
        evaluator = AgentEvaluator(db)
        report = evaluator.run()
    finally:
        db.close()

    json_path, html_path = write_report(report, Path(args.output_dir))
    print(f"报告已写入：{json_path}")
    print(f"报告已写入：{html_path}")
    _print_summary(report)


if __name__ == "__main__":
    main()
