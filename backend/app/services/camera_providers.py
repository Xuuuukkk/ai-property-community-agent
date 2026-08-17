"""Pluggable capture sources for the automated patrol feature.

Each provider implements ``capture`` and returns image bytes. This keeps the
inspection service agnostic of where a screenshot comes from: local image
directories (for testing/demo), RTSP streams (real cameras), or future
platform APIs can all be added without touching the inspection logic.
"""

from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Protocol

from app.core.config import get_settings


class CameraProvider(Protocol):
    """Interface for a capture source."""

    def capture(self, config: dict) -> bytes:
        """Return the raw bytes of one captured image."""
        ...


class LocalDirProvider:
    """Read a single image from a local directory (used for tests/demo)."""

    def capture(self, config: dict) -> bytes:
        directory = Path(config.get("directory", ""))
        if not directory.is_dir():
            raise FileNotFoundError(f"Local inspection directory not found: {directory}")

        # Pick the newest image file in the directory (a simple rotating queue).
        images = sorted(
            (p for p in directory.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png")),
            key=lambda p: p.stat().st_mtime,
        )
        if not images:
            raise FileNotFoundError(f"No images found in {directory}")
        return images[-1].read_bytes()


class RTSPProvider:
    """Pull a single frame from an RTSP stream using ffmpeg.

    Requires ``ffmpeg`` to be installed on the host/container. Not used by the
    demo providers, but wired here so real cameras are a config change away.
    """

    def capture(self, config: dict) -> bytes:
        rtsp_url = config.get("rtsp_url", "")
        if not rtsp_url:
            raise ValueError("RTSP provider requires rtsp_url in source_config")

        cmd = [
            "ffmpeg",
            "-rtsp_transport", "tcp",
            "-i", rtsp_url,
            "-frames:v", "1",
            "-f", "image2pipe",
            "-vcodec", "mjpeg",
            "-",
        ]
        proc = subprocess.run(cmd, capture_output=True, timeout=30)
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg capture failed: {proc.stderr.decode()[:200]}")
        return proc.stdout


def get_camera_provider(provider_type: str) -> CameraProvider:
    """Return the capture provider for the given type string."""
    providers: dict[str, CameraProvider] = {
        "local_dir": LocalDirProvider(),
        "rtsp": RTSPProvider(),
    }
    if provider_type not in providers:
        raise ValueError(f"Unknown camera provider type: {provider_type}")
    return providers[provider_type]
