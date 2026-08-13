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
from app.agents.intent import INTENTS, classify_intent
from app.agents.response import generate_response
from app.agents.state import (
    AgentState,
    get_final_response,
    get_intent,
    get_messages,
)
from app.core.database import SessionLocal
from app.core.llm import get_llm


@dataclass
class AgentResult:
    """Result returned to callers of the agent graph."""

    conversation_id: str
    intent: str
    response: str
    tool_results: list[dict[str, Any]]
    requires_human: bool = False


def router_node(state: AgentState) -> AgentState:
    """Classify intent and initialize the conversation context."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if isinstance(msg, HumanMessage):
            user_text = msg.content
            break

    llm = get_llm()
    intent = classify_intent(user_text, llm=llm)
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
            result = run_knowledge_agent(db, state)
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
    """Format the final answer.

    When an LLM is configured, the domain agent's deterministic response is
    passed to the model for natural-language rephrasing. Otherwise the
    deterministic text is returned directly.
    """
    final_response = get_final_response(state)
    if not final_response:
        state["final_response"] = "抱歉，我暂时无法处理您的请求。"
        return state

    llm = get_llm()
    if llm is None:
        return state

    user_text = ""
    for msg in reversed(get_messages(state)):
        if isinstance(msg, HumanMessage):
            user_text = msg.content
            break

    rephrased = generate_response(
        user_text,
        state.get("tool_results", []),
        llm=llm,
    )
    if rephrased:
        state["final_response"] = rephrased

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
    db: Session | None = None,
) -> AgentResult:
    """Run the agent graph for a single user message.

    This is the main public entry point used by REST API. When ``db`` is
    provided, the conversation and tool traces are persisted for evaluation
    and debugging.
    """
    messages: list[AnyMessage] = []
    if system_message:
        messages.append(SystemMessage(content=system_message))
    messages.append(HumanMessage(content=user_input))

    session_id = conversation_id or str(uuid.uuid4())
    initial_state: AgentState = {
        "user_id": user_id,
        "conversation_id": session_id,
        "messages": messages,
    }

    final_state = agent_graph.invoke(initial_state)
    result = AgentResult(
        conversation_id=final_state.get("conversation_id", session_id),
        intent=final_state.get("intent") or "unknown",
        response=final_state.get("final_response") or "",
        tool_results=final_state.get("tool_results", []),
        requires_human=final_state.get("requires_human", False),
    )

    if db is not None:
        # Imported locally to avoid import cycles at module load time.
        from app.services.tracing import record_turn

        record_turn(
            db,
            session_id=result.conversation_id,
            user_id=user_id,
            user_message=user_input,
            assistant_message=result.response,
            intent=result.intent,
            tool_results=result.tool_results,
        )

    return result
