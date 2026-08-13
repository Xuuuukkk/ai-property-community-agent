"""Natural language response generation for agent tool results.

When an LLM is configured, tool outputs are passed to the model to produce a
concise, user-facing answer. Otherwise the deterministic formatting already
provided by the domain agents is used.
"""

from __future__ import annotations

import json
import logging
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from langchain_openai import ChatOpenAI

logger = logging.getLogger(__name__)


def generate_response(
    user_text: str,
    tool_results: list[dict[str, Any]],
    *,
    llm: "ChatOpenAI | None" = None,
    system_prompt: str | None = None,
) -> str | None:
    """Return a natural language response based on tool results.

    If ``llm`` is None or generation fails, returns ``None`` so the caller can
    fall back to its own deterministic formatting.
    """
    if llm is None or not tool_results:
        return None

    system = system_prompt or (
        "你是云溪花园小区的 AI 物业助手。请根据系统查询到的结果，用简洁、"
        "自然的中文回答业主的问题。不要编造信息，只使用提供的工具结果。"
    )

    # Build a compact context string from the tool results.
    context_items = []
    for result in tool_results:
        if not isinstance(result, dict):
            continue
        tool_name = result.get("tool", "unknown")
        output = result.get("output", result)
        context_items.append(f"[{tool_name}] {json.dumps(output, ensure_ascii=False, default=str)}")

    if not context_items:
        return None

    user_prompt = (
        f"用户问题：{user_text}\n\n"
        f"系统查询结果：\n" + "\n".join(context_items) + "\n\n请直接回答用户。"
    )

    try:
        from langchain_core.messages import HumanMessage, SystemMessage

        response = llm.invoke(
            [
                SystemMessage(content=system),
                HumanMessage(content=user_prompt),
            ]
        )
        content = response.content if response else ""
        if content and isinstance(content, str):
            return content.strip()
    except Exception as exc:  # pragma: no cover - network failures fall back gracefully
        logger.warning("llm_response_failed", extra={"input": user_text, "error": str(exc)})

    return None
