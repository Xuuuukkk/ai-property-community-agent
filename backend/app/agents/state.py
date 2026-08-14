"""Shared state schema for the LangGraph agent system.

LangGraph expects the state to be a TypedDict. Nodes receive plain dicts at
runtime, so helper functions are provided for safe access.
"""

from __future__ import annotations

from typing import Any, TypedDict

from langchain_core.messages import AnyMessage


class AgentState(TypedDict, total=False):
    """State schema passed between LangGraph nodes."""

    user_id: int | None
    conversation_id: str
    messages: list[AnyMessage]
    intent: str | None
    entities: dict[str, Any]
    tool_results: list[dict[str, Any]]
    final_response: str | None
    requires_human: bool
    pending_repair: dict[str, Any] | None


def get_user_id(state: AgentState) -> int | None:
    return state.get("user_id")


def get_conversation_id(state: AgentState) -> str:
    return state.get("conversation_id", "")


def get_messages(state: AgentState) -> list[AnyMessage]:
    return state.get("messages", [])


def get_intent(state: AgentState) -> str | None:
    return state.get("intent")


def get_entities(state: AgentState) -> dict[str, Any]:
    return state.get("entities", {})


def get_tool_results(state: AgentState) -> list[dict[str, Any]]:
    return state.get("tool_results", [])


def get_final_response(state: AgentState) -> str | None:
    return state.get("final_response")


def get_requires_human(state: AgentState) -> bool:
    return state.get("requires_human", False)
