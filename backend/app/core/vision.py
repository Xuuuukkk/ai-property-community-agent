"""Vision provider for the automated patrol inspection feature.

Uses an OpenAI-compatible multimodal endpoint (Zhipu GLM-4V family by default)
to analyze a single screenshot and return a structured anomaly assessment.
"""

from __future__ import annotations

import base64
from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings

# Prompt that asks the model for a compact, machine-parseable result. Keep the
# JSON keys stable so the inspection service can persist them reliably.
ANALYSIS_SYSTEM_PROMPT = (
    "你是小区监控画面巡检助手。分析给定的监控截图，判断是否存在异常。"
    "只输出一个 JSON 对象，不要输出其他任何文字或代码块。"
)

ANALYSIS_USER_PROMPT = (
    "请分析这张小区监控截图，检查是否存在以下异常：垃圾堆积、车辆违停、"
    "消防通道堵塞、烟雾或明火、可疑人员聚集、楼道堆物。"
    "输出 JSON，字段如下：\n"
    '{{"anomaly_type": "异常类型，正常则为 null", '
    '"confidence": 0.0到1.0之间的数值, '
    '"summary": "一句话描述画面内容"}}\n'
    "如果画面正常，anomaly_type 返回 null，confidence 返回 0。"
)


class VisionProvider(Protocol):
    """Minimal interface for multimodal image analysis."""

    def analyze_image(self, image_bytes: bytes) -> dict:
        """Analyze an image and return a structured dict with keys:
        ``anomaly_type``, ``confidence``, ``summary``.
        """
        ...


class _ZhipuVisionProvider:
    """Zhipu GLM-4V vision analysis via the OpenAI-compatible chat endpoint."""

    def __init__(self, model: str, api_key: str, base_url: str) -> None:
        from openai import OpenAI

        self._model = model
        self._client = OpenAI(api_key=api_key, base_url=base_url)

    def analyze_image(self, image_bytes: bytes) -> dict:
        data_url = "data:image/jpeg;base64," + base64.b64encode(image_bytes).decode("utf-8")
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": ANALYSIS_USER_PROMPT},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                },
            ],
            temperature=0.1,
            max_tokens=500,
        )
        content = response.choices[0].message.content or ""
        return _parse_json_result(content)


def _parse_json_result(content: str) -> dict:
    """Parse the model's JSON output, tolerating markdown code fences."""
    import json

    text = content.strip()
    # Strip ```json ... ``` fences if present.
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Fall back to treating the raw text as the summary.
        return {"anomaly_type": None, "confidence": 0.0, "summary": content.strip()}


@lru_cache
def get_vision_provider() -> VisionProvider | None:
    """Return a cached vision provider, or None if no API key is configured."""
    settings = get_settings()
    if not settings.LLM_API_KEY:
        return None
    return _ZhipuVisionProvider(
        model=settings.VISION_MODEL,
        api_key=settings.LLM_API_KEY,
        base_url=settings.OPENAI_API_BASE,
    )
