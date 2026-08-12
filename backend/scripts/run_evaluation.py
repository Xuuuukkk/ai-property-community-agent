"""Run the agent evaluation suite from the command line.

Example::

    cd backend
    python -m scripts.run_evaluation

The script writes two reports to ``backend/reports/``:

- evaluation-report.json
- evaluation-report.html
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Allow running from backend/ without installing the package.
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.agents.evaluation.report import write_report
from app.agents.evaluation.runner import AgentEvaluator
from app.core.database import SessionLocal


def main() -> int:
    """Run evaluation and write reports."""
    output_dir = BACKEND_DIR / "reports"

    db = SessionLocal()
    try:
        evaluator = AgentEvaluator(db)
        report = evaluator.run()
        json_path, html_path = write_report(report, output_dir)
        print(f"Evaluation complete.")
        print(f"  JSON: {json_path}")
        print(f"  HTML: {html_path}")
        print(f"  Intent accuracy:     {report.intent.accuracy:.2%}")
        print(f"  Tool accuracy:       {report.tool.tool_accuracy:.2%}")
        print(f"  Parameter accuracy:  {report.tool.parameter_accuracy:.2%}")
        print(f"  Workflow success:    {report.workflow.success_rate:.2%}")
        print(f"  RAG Recall@5:        {report.rag.recall_at_5_rate:.2%}")
        print(f"  RAG MRR:             {report.rag.mrr:.3f}")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
