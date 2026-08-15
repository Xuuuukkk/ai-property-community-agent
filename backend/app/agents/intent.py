"""Intent classification for the agent router.

Provides a deterministic rule-based classifier that is always available, plus
an optional LLM-based classifier used when ``LLM_API_KEY`` is configured.
"""

from __future__ import annotations

import json
import logging
import re
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from langchain_openai import ChatOpenAI

logger = logging.getLogger(__name__)

INTENTS = {"repair", "fee", "notice_query", "notice_publish", "knowledge", "unknown"}


def classify_intent_rule(text: str) -> str:
    """Deterministic rule-based intent classifier.

    The rules are intentionally simple so tests are stable and the system
    works without an external API key.
    """
    lowered = text.lower()

    # Notice: split into query (read) and publish (write) intents.
    # Publish verbs must be checked first because a phrase like "发布停水通知"
    # contains both "发布" and "通知".
    if any(k in lowered for k in ("发布", "发公告", "发通知", "公布", "贴出", "张贴", "publish", "post")):
        return "notice_publish"

    # Query: community announcements / outage notifications (checked before
    # repair because phrases like "停水维修" are announcements).
    # "停电" alone is intentionally excluded to avoid misclassifying
    # "停电动车" as a notice; "停电通知" still matches because it contains "通知".
    if any(k in lowered for k in ("公告", "通知", "停水", "停电通知", "notice", "announcement", "社区活动")):
        return "notice_query"

    # Fee: billing and payment queries.
    if any(k in lowered for k in ("物业费", "费用", "账单", "缴费", "欠费", "fee", "bill", "payment")):
        return "fee"

    # Knowledge: regulations, hours, FAQ.
    if any(k in lowered for k in ("装修", "几点", "规定", "制度", "faq", "知识", "knowledge")):
        return "knowledge"

    # Repair: breakdown reports (avoid matching the single character "修" alone).
    if any(k in lowered for k in ("报修", "维修", "漏水", "跳闸", "坏了", "repair", "leak", "broken")):
        return "repair"

    return "unknown"


def _parse_intent_from_llm_output(content: str) -> str | None:
    """Extract a valid intent label from LLM output."""
    if not content:
        return None

    # Try JSON first.
    try:
        data = json.loads(content.strip())
        if isinstance(data, dict) and "intent" in data:
            intent = str(data["intent"]).strip().lower()
            if intent in INTENTS:
                return intent
    except json.JSONDecodeError:
        pass

    # Fall back to looking for one of the known labels in the text.
    lowered = content.lower()
    for intent in INTENTS:
        if re.search(rf"\b{intent}\b", lowered):
            return intent

    return None


def classify_intent(text: str, llm: "ChatOpenAI | None" = None) -> str:
    """Classify user text into one of the supported intents.

    Rule-first strategy: deterministic keyword rules decide the common cases
    so tests and high-frequency queries are stable and do not require an LLM.
    The LLM is only consulted when rules return ``unknown``. This prevents
    common misclassifications such as "停电动车" being matched as a notice.
    """
    rule_intent = classify_intent_rule(text)
    if rule_intent != "unknown":
        return rule_intent

    if llm is None:
        return "unknown"

    system_prompt = (
        "You are an intent classifier for a property community AI assistant. "
        "Classify the user's message into exactly one of: "
        "repair, fee, notice_query, notice_publish, knowledge, unknown.\n"
        "- notice_query: the user wants to READ or CHECK community notices.\n"
        "- notice_publish: the user wants to CREATE or SEND a community notice.\n"
        "- knowledge: the user asks about community regulations, hours, or FAQ.\n"
        "Respond with a JSON object: {\"intent\": \"...\"}. No other text."
    )

    try:
        from langchain_core.messages import HumanMessage, SystemMessage

        response = llm.invoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=text),
            ]
        )
        content = response.content if response else ""
        intent = _parse_intent_from_llm_output(content)
        if intent is not None:
            logger.debug("llm_intent_classified", extra={"input": text, "intent": intent})
            return intent
        logger.warning("llm_intent_unrecognized", extra={"input": text, "raw": content})
    except Exception as exc:  # pragma: no cover - network failures fall back gracefully
        logger.warning("llm_intent_failed", extra={"input": text, "error": str(exc)})

    return "unknown"
