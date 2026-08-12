"""LangGraph-based agent orchestration.

The graph coordinates:

1. Router node: classify user intent into one of
   [repair, fee, notice, knowledge, unknown].
2. Domain agent node: extract parameters and call the appropriate tools.
3. Response node: format the final answer for the user.

When OPENAI_API_KEY is configured, the router can optionally use an LLM.
By default a deterministic rule-based classifier is used so the system is
fully testable without external API keys.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from typing import Any

from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph
from sqlalchemy.orm import Session

from app.agents.domain_agents import (
    run_fee_agent,
    run_knowledge_agent,
    run_notice_agent,
    run_repair_agent,
)
from app.agents.state import (
    AgentState,
    get_final_response,
    get_intent,
    get_messages,
)
from app.core.database import SessionLocal

INTENTS = {"repair", "fee", "notice", "knowledge", "unknown"}


@dataclass
class AgentResult:
    """Result returned to callers of the agent graph."""

    conversation_id: str
    intent: str
    response: str
    tool_results: list[dict[str, Any]]
    requires_human: bool = False


def _classify_intent(text: str) -> str:
    """Rule-based intent classifier.

    The rules are intentionally simple and deterministic so tests are stable.
    Order matters: more specific intents are checked first.
    """
    lowered = text.lower()

    # Notice: community announcements / outage notifications (checked before
    # repair because phrases like "停水维修" are announcements).
    if any(k in lowered for k in ("公告", "通知", "停水", "停电", "notice", "announcement")):
        return "notice"

    # Fee: billing and payment queries.
    if any(k in lowered for k in ("物业费", "费用", "账单", "缴费", "欠费", "fee", "bill", "payment")):
        return "fee"

    # Knowledge: regulations, hours, FAQ.
    if any(k in lowered for k in ("装修", "几点", "规定", "制度", "faq", "知识", "knowledge", "?", "？")):
        return "knowledge"

    # Repair: breakdown reports (avoid matching the single character "修" alone).
    if any(k in lowered for k in ("报修", "维修", "漏水", "跳闸", "坏了", "repair", "leak", "broken")):
        return "repair"

    return "unknown"


def router_node(state: AgentState) -> AgentState:
    """Classify intent and initialize the conversation context."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if isinstance(msg, HumanMessage):
            user_text = msg.content
            break

    intent = _classify_intent(user_text)
    state["intent"] = intent
    state["tool_results"] = []
    state["requires_human"] = False
    return state


def agent_node(state: AgentState) -> AgentState:
    """Dispatch to the correct domain agent based on intent."""
    intent = get_intent(state) or "unknown"
    db: Session = SessionLocal()
    try:
        if intent == "repair":
            result = run_repair_agent(db, state)
        elif intent == "fee":
            result = run_fee_agent(db, state)
        elif intent == "notice":
            result = run_notice_agent(db, state)
        elif intent == "knowledge":
            result = run_knowledge_agent(state)
        else:
            result = {
                "response": "抱歉，我不太理解您的需求。您可以尝试描述：报修、查物业费、发布公告或咨询社区规定。",
                "tool_results": [],
                "requires_human": False,
            }
        state["final_response"] = result.get("response", "")
        state["tool_results"] = result.get("tool_results", [])
        state["requires_human"] = result.get("requires_human", False)
    finally:
        db.close()
    return state


def response_node(state: AgentState) -> AgentState:
    """No-op response formatter.

    The domain agents already produce user-facing text. This node exists so
    future enhancements (e.g. LLM rephrasing, guardrails) can be inserted here
    without changing the graph topology.
    """
    if not get_final_response(state):
        state["final_response"] = "抱歉，我暂时无法处理您的请求。"
    return state


def _route_by_intent(state: AgentState) -> str:
    intent = get_intent(state) or "unknown"
    if intent in INTENTS:
        return intent if intent != "unknown" else "agent_node"
    return "agent_node"


# Build the graph once at import time.
_builder = StateGraph(AgentState)
_builder.add_node("router", router_node)
_builder.add_node("agent", agent_node)
_builder.add_node("response", response_node)

_builder.add_edge(START, "router")
_builder.add_conditional_edges(
    "router",
    _route_by_intent,
    {
        "repair": "agent",
        "fee": "agent",
        "notice": "agent",
        "knowledge": "agent",
        "unknown": "agent",
        "agent_node": "agent",
    },
)
_builder.add_edge("agent", "response")
_builder.add_edge("response", END)

agent_graph = _builder.compile()


def run_agent(
    user_input: str,
    *,
    user_id: int | None = None,
    conversation_id: str | None = None,
    system_message: str | None = None,
) -> AgentResult:
    """Run the agent graph for a single user message.

    This is the main public entry point used by REST API.
    """
    messages: list[AnyMessage] = []
    if system_message:
        messages.append(SystemMessage(content=system_message))
    messages.append(HumanMessage(content=user_input))

    initial_state: AgentState = {
        "user_id": user_id,
        "conversation_id": conversation_id or str(uuid.uuid4()),
        "messages": messages,
    }

    final_state = agent_graph.invoke(initial_state)
    return AgentResult(
        conversation_id=final_state.get("conversation_id", ""),
        intent=final_state.get("intent") or "unknown",
        response=final_state.get("final_response") or "",
        tool_results=final_state.get("tool_results", []),
        requires_human=final_state.get("requires_human", False),
    )
