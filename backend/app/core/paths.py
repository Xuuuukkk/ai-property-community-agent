"""Path helpers for locating repository resources.

The application can run both locally (repo root is a few levels above this
file) and inside a Docker container where the project is mounted at ``/app``.
This module provides a single, robust way to find the repository root and
important subdirectories regardless of the execution environment.
"""

from __future__ import annotations

import os
from pathlib import Path


def _find_repo_root() -> Path:
    """Return the repository root directory.

    The root is identified by the presence of ``knowledge-base/`` and
    ``evaluation/`` directories. If the ``REPO_ROOT`` environment variable is
    set, it takes precedence.
    """
    env_root = os.environ.get("REPO_ROOT")
    if env_root:
        return Path(env_root).resolve()

    # Common container path is tried first because local discovery may also
    # accidentally match a parent directory on the host.
    candidates: list[Path] = [Path("/app")]

    # Walk up from this file; stop at a reasonable depth to avoid scanning
    # the whole filesystem.
    for idx, parent in enumerate(Path(__file__).resolve().parents):
        if idx > 6:
            break
        candidates.append(parent)

    for candidate in candidates:
        if (
            candidate.joinpath("knowledge-base").is_dir()
            and candidate.joinpath("evaluation").is_dir()
        ):
            return candidate

    raise RuntimeError(
        "Cannot locate repository root. Ensure knowledge-base/ and evaluation/ "
        "directories exist, or set the REPO_ROOT environment variable."
    )


REPO_ROOT: Path = _find_repo_root()
KNOWLEDGE_BASE_DIR: Path = REPO_ROOT / "knowledge-base"
EVALUATION_DIR: Path = REPO_ROOT / "evaluation"
