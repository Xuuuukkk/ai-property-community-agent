"""Load evaluation datasets from the repository root."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def _repo_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parents[4]


def _load_json(filename: str) -> list[dict[str, Any]]:
    path = _repo_root() / "evaluation" / filename
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
        return data if isinstance(data, list) else []


def load_evaluation_datasets() -> dict[str, list[dict[str, Any]]]:
    """Return all evaluation datasets keyed by category."""
    return {
        "intent": _load_json("intent_cases.json"),
        "tool": _load_json("tool_cases.json"),
        "workflow": _load_json("workflow_cases.json"),
        "rag": _load_json("rag_questions.json"),
    }
