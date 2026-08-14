"""Domain agents invoked by the router.

Each agent extracts parameters from the user's message and calls the relevant
business tools. The current implementation is deterministic and rule-based so
it works without an LLM API key, while preserving the LangGraph structure for
future LLM-based upgrades.
"""

from __future__ import annotations

import re
from typing import Any

from sqlalchemy.orm import Session

from app.agents import tools as agent_tools
from app.agents.state import AgentState, get_messages, get_user_id
from app.models.house_binding import HouseBinding


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _extract_user_id_from_state(state: AgentState) -> int | None:
    """Return explicit user_id from state if present."""
    return get_user_id(state)


def _get_default_house_id(db: Session, user_id: int) -> int | None:
    """Return the first house_id bound to the user, if any."""
    binding = (
        db.query(HouseBinding)
        .filter(HouseBinding.user_id == user_id)
        .order_by(HouseBinding.id)
        .first()
    )
    return binding.house_id if binding else None


def _extract_house_id(text: str) -> int | None:
    """Try to find a house id in the user message."""
    match = re.search(r"房屋\s*[:：]?\s*(\d+)", text)
    if match:
        return int(match.group(1))
    return None


def _extract_repair_type(text: str) -> str:
    """Map Chinese keywords to repair type enum values."""
    lowered = text.lower()
    if any(k in lowered for k in ("漏水", "水管", "water", "leak")):
        return "water_leak"
    if any(k in lowered for k in ("电梯", "elevator")):
        return "elevator_fault"
    if any(k in lowered for k in ("门禁", "access", "door")):
        return "access_control"
    if any(k in lowered for k in ("跳闸", "电", "power", "electric")):
        return "power_trip"
    if any(k in lowered for k in ("渗水", "墙面", "wall", "seepage")):
        return "wall_seepage"
    return "public_facility"


def _extract_urgency(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in ("紧急", " urgent", "urgent", "马上", "立刻")):
        return "URGENT"
    if any(k in lowered for k in ("严重", "high", "很急")):
        return "HIGH"
    if any(k in lowered for k in ("轻微", "low", "不急")):
        return "LOW"
    return "MEDIUM"


def _tool_output(result: dict[str, Any]) -> dict[str, Any]:
    """Return the output payload from a tool result wrapper.

    Tools now return ``{"tool": ..., "input": ..., "output": ...}``; this
    helper lets domain agents read the wrapped output transparently.
    """
    return result.get("output", result) if isinstance(result, dict) else result


# ---------------------------------------------------------------------------
# Repair Agent
# ---------------------------------------------------------------------------


def run_repair_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle repair intents: create or query repair orders."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    user_id = _extract_user_id_from_state(state) or 1
    lowered = user_text.lower()

    # Query path
    if any(k in lowered for k in ("查", "进度", "状态", "处理", "status", "query", "list")):
        result = agent_tools.query_repair_order(db, user_id=user_id)
        output = _tool_output(result)
        orders = output.get("orders", [])
        if not orders:
            return {"response": "您当前没有维修工单。", "tool_results": [result]}
        lines = [f"• {o['order_no']} | {o['type']} | {o['status']} | {o['description'] or '无描述'}" for o in orders]
        return {
            "response": f"您最近的维修工单：\n" + "\n".join(lines),
            "tool_results": [result],
        }

    # Create path
    house_id = _extract_house_id(user_text)
    repair_type = _extract_repair_type(user_text)
    urgency = _extract_urgency(user_text)

    # Extract a simple description: remove common prefixes and trailing punctuation.
    description = user_text
    for prefix in ("我要报修", "帮我报修", "报修", "repair", "维修"):
        if description.lower().startswith(prefix):
            description = description[len(prefix):].strip("，,。.:： ")
    if not description:
        description = "业主报修"

    # Auto-resolve house_id from the user's binding if not explicitly provided.
    if house_id is None:
        house_id = _get_default_house_id(db, user_id)

    missing = []
    if house_id is None:
        missing.append("房屋信息")
    if not description or description == "业主报修":
        missing.append("问题描述")

    if missing:
        return {
            "response": f"请补充以下信息以便创建工单：{', '.join(missing)}",
            "tool_results": [],
            "requires_human": False,
        }

    result = agent_tools.create_repair_order(
        db,
        user_id=user_id,
        house_id=house_id,
        type=repair_type,
        description=description,
        urgency=urgency,
    )
    return {
        "response": _tool_output(result).get("message", "工单已创建"),
        "tool_results": [result],
    }


# ---------------------------------------------------------------------------
# Fee Agent
# ---------------------------------------------------------------------------


def run_fee_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle fee intents: query bills or payment status."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    user_id = _extract_user_id_from_state(state) or 1
    result = agent_tools.query_payment_status(db, user_id=user_id)
    return {
        "response": _tool_output(result).get("message", "费用查询完成"),
        "tool_results": [result],
    }


# ---------------------------------------------------------------------------
# Notice Agent
# ---------------------------------------------------------------------------


def run_notice_query_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle notice_query intents: list or search community notices."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    lowered = user_text.lower()
    page_size = 10
    # Allow the user to ask for a specific number of recent notices.
    match = re.search(r"(\d+)\s*条", user_text)
    if match:
        page_size = min(int(match.group(1)), 20)

    status = "PUBLISHED"
    if any(k in lowered for k in ("草稿", "draft")):
        status = "DRAFT"

    result = agent_tools.list_notices(db, page=1, page_size=page_size, status=status)
    output = _tool_output(result)
    notices = output.get("notices", [])
    if not notices:
        return {
            "response": output.get("message", "暂无公告"),
            "tool_results": [result],
        }

    lines = ["最新公告："]
    for n in notices:
        pinned = "【置顶】" if n.get("is_pinned") else ""
        lines.append(f"{pinned}{n.get('title', '无标题')}\n  {n.get('content', '')}")

    return {
        "response": "\n\n".join(lines),
        "tool_results": [result],
    }


def run_notice_publish_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle notice_publish intents: generate or publish community notices."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    lowered = user_text.lower()
    user_id = _extract_user_id_from_state(state) or 1

    # Simple rule: if the message asks for a draft, generate one without persisting.
    if any(k in lowered for k in ("生成", "草稿", "draft", "生成公告")):
        draft = agent_tools.generate_notice(
            title="社区通知",
            content=user_text,
            publisher_id=user_id,
        )
        draft_out = _tool_output(draft)
        return {
            "response": (
                f"公告草稿已生成：\n"
                f"标题：{draft_out.get('title', '社区通知')}\n"
                f"内容：{draft_out.get('content', user_text)}\n"
                f"请确认后发布。"
            ),
            "tool_results": [draft],
            "requires_human": True,
        }

    # Otherwise publish directly (production should require explicit confirmation).
    result = agent_tools.publish_notice(
        db,
        title="社区通知",
        content=user_text,
        publisher_id=user_id,
        notice_type="facility_notice",
    )
    return {
        "response": _tool_output(result).get("message", "公告已发布"),
        "tool_results": [result],
    }


# Backwards-compatible alias.
run_notice_agent = run_notice_publish_agent


# ---------------------------------------------------------------------------
# Knowledge Agent
# ---------------------------------------------------------------------------


def run_knowledge_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle knowledge intents using pgvector RAG retrieval."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    result = agent_tools.search_knowledge(db, user_text, top_k=5)
    output = _tool_output(result)
    chunks = output.get("results", [])

    if not chunks:
        return {
            "response": output.get("message", "知识库中未找到相关内容。"),
            "tool_results": [result],
        }

    # Build a concise, cited answer from the retrieved chunks.
    lines = ["根据知识库相关规定："]
    for idx, chunk in enumerate(chunks, start=1):
        source = chunk.get("source_path", "未知来源")
        content = chunk.get("content", "").replace("\n", " ")
        lines.append(f"{idx}. {content}（来源：{source}）")

    answer = "\n".join(lines)
    return {
        "response": answer,
        "tool_results": [result],
    }
