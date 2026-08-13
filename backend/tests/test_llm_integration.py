"""Tests for LLM-based intent classification and response generation."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from app.agents.intent import classify_intent, classify_intent_rule
from app.agents.response import generate_response


class FakeLLMResponse:
    """Minimal stand-in for a LangChain LLM response."""

    def __init__(self, content: str) -> None:
        self.content = content


class FakeLLM:
    """Fake LLM that returns a fixed response."""

    def __init__(self, content: str) -> None:
        self._content = content

    def invoke(self, messages: list[Any]) -> FakeLLMResponse:
        return FakeLLMResponse(self._content)


def test_rule_classifier_repair() -> None:
    assert classify_intent_rule("我家厨房漏水了") == "repair"


def test_rule_classifier_fee() -> None:
    assert classify_intent_rule("查物业费") == "fee"


def test_rule_classifier_notice() -> None:
    assert classify_intent_rule("明天停水通知") == "notice"


def test_rule_classifier_knowledge() -> None:
    assert classify_intent_rule("装修几点可以施工？") == "knowledge"


def test_rule_classifier_unknown() -> None:
    assert classify_intent_rule("随便聊聊") == "unknown"


def test_llm_intent_json() -> None:
    llm = FakeLLM('{"intent": "fee"}')
    assert classify_intent("物业费多少", llm=llm) == "fee"


def test_llm_intent_plain_text() -> None:
    llm = FakeLLM("The intent is repair.")
    assert classify_intent("水管坏了", llm=llm) == "repair"


def test_llm_intent_invalid_falls_back_to_rule() -> None:
    llm = FakeLLM('{"intent": "invalid_label"}')
    assert classify_intent("查物业费", llm=llm) == "fee"


def test_llm_intent_exception_falls_back_to_rule() -> None:
    llm = MagicMock()
    llm.invoke.side_effect = RuntimeError("network error")
    assert classify_intent("查物业费", llm=llm) == "fee"


def test_generate_response_with_llm() -> None:
    llm = FakeLLM("您有 2 笔未缴账单，合计 ¥300。")
    tool_results = [
        {
            "tool": "query_payment_status",
            "input": {"user_id": 1},
            "output": {"unpaid_count": 2, "total_unpaid": "300.00"},
        }
    ]
    response = generate_response("物业费多少", tool_results, llm=llm)
    assert response == "您有 2 笔未缴账单，合计 ¥300。"


def test_generate_response_returns_none_without_llm() -> None:
    result = generate_response("物业费多少", [], llm=None)
    assert result is None


def test_generate_response_returns_none_on_empty_results() -> None:
    llm = FakeLLM("should not be used")
    result = generate_response("物业费多少", [], llm=llm)
    assert result is None
