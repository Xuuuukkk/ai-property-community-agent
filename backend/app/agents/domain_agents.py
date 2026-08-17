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
from app.agents.response import generate_response
from app.agents.state import AgentState, get_messages, get_user_id
from app.core.llm import get_llm
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


def _extract_images(text: str) -> list[str]:
    """Extract base64 data URLs for images embedded in the message."""
    pattern = r"data:image/[^;]+;base64,[A-Za-z0-9+/=]+"
    return re.findall(pattern, text)


def _tool_output(result: dict[str, Any]) -> dict[str, Any]:
    """Return the output payload from a tool result wrapper.

    Tools now return ``{"tool": ..., "input": ..., "output": ...}``; this
    helper lets domain agents read the wrapped output transparently.
    """
    return result.get("output", result) if isinstance(result, dict) else result


# ---------------------------------------------------------------------------
# Repair Agent
# ---------------------------------------------------------------------------


def _is_repair_intent(text: str) -> bool:
    """Return True if the message looks like a repair request."""
    lowered = text.lower()
    keywords = (
        "报修", "维修", "修理", "修", "坏了", "故障", "漏水", "跳闸",
        "repair", "broken", "fix", "leak", "elevator", "water",
    )
    return any(k in lowered for k in keywords)


def _format_worker_info(worker: dict[str, Any] | None) -> str:
    """Format assigned worker contact info for the owner."""
    if not worker:
        return "暂未分配维修师傅。"
    name = worker.get("real_name") or f"师傅#{worker.get('id')}"
    phone = worker.get("phone") or "暂无电话"
    dept = worker.get("department") or "维修部"
    return f"已派单给 {name}（{dept}），联系电话：{phone}。"


def _create_repair_order_response(db: Session, user_id: int, pending: dict[str, Any], user_text: str) -> dict[str, Any]:
    """Create the repair order from collected info and return the response.

    Shared by the ``collect_description`` and ``confirm`` steps so the order
    (and the assigned worker's contact info) is produced in the same turn the
    owner finishes describing the problem.
    """
    item = pending.get("item", "业主报修")
    description = pending.get("description", user_text) or item
    combined_description = f"{item}：{description}"

    house_id = _extract_house_id(user_text) or _get_default_house_id(db, user_id)
    repair_type = _extract_repair_type(combined_description)
    urgency = _extract_urgency(combined_description)

    result = agent_tools.create_repair_order(
        db,
        user_id=user_id,
        house_id=house_id,
        type=repair_type,
        description=combined_description,
        urgency=urgency,
        image_urls=pending.get("image_urls"),
    )
    output = _tool_output(result)
    order_no = output.get("order_no", "")
    worker = output.get("worker")

    response = (
        f"工单已创建，编号：{order_no}，紧急程度：{urgency}，当前状态：{output.get('status', 'CREATED')}。\n"
        + _format_worker_info(worker)
        + "\n维修完成后，您和师傅都需要在页面上确认，工单才会正式关闭。"
    )
    return {
        "response": response,
        "tool_results": [result],
        "pending_repair": None,
        "skip_llm_rewrite": True,
    }


def _format_notice_time(created_at: Any) -> str:
    """Return a short, human-readable time string for a notice."""
    if created_at is None:
        return ""
    if isinstance(created_at, str):
        return created_at[:10] if len(created_at) >= 10 else created_at
    # datetime-like object.
    return created_at.strftime("%Y-%m-%d") if hasattr(created_at, "strftime") else str(created_at)[:10]


def run_repair_agent(db: Session, state: AgentState) -> dict[str, Any]:
    """Handle repair intents with multi-turn collection and auto-dispatch."""
    user_text = ""
    for msg in reversed(get_messages(state)):
        if hasattr(msg, "content"):
            user_text = str(msg.content)
            break

    user_id = _extract_user_id_from_state(state) or 1
    pending = state.get("pending_repair") or {}
    lowered = user_text.lower()

    # Query path: user asks about existing orders.
    if any(k in lowered for k in ("查", "进度", "状态", "处理", "status", "query", "list")):
        result = agent_tools.query_repair_order(db, user_id=user_id)
        output = _tool_output(result)
        orders = output.get("orders", [])
        if not orders:
            return {
                "response": "您当前没有维修工单。",
                "tool_results": [result],
                "skip_llm_rewrite": True,
            }
        lines = [f"• {o['order_no']} | {o['type']} | {o['status']} | {o['description'] or '无描述'}" for o in orders]
        return {
            "response": f"您最近的维修工单：\n" + "\n".join(lines),
            "tool_results": [result],
            "skip_llm_rewrite": True,
        }

    # Start a new repair collection if not already pending.
    if not pending and _is_repair_intent(user_text):
        return {
            "response": "好的，我来帮您报修。请问是什么东西坏了？可以简单描述一下位置和问题。",
            "tool_results": [],
            "requires_human": False,
            "pending_repair": {"step": "collect_item"},
            "skip_llm_rewrite": True,
        }

    # Multi-turn collection flow.
    if pending:
        step = pending.get("step")
        images = _extract_images(user_text)

        if step == "collect_item":
            item = user_text.strip()
            if not item or len(item) < 2:
                return {
                    "response": "麻烦您再说清楚一点，具体是什么东西坏了？比如‘厨房水龙头漏水’。",
                    "tool_results": [],
                    "pending_repair": pending,
                    "skip_llm_rewrite": True,
                }
            pending["item"] = item
            pending["step"] = "collect_description"
            # Echo the item back to the user, but avoid sounding like the bot
            # itself lives in the house ("我家" -> "您家").
            display_item = item
            if display_item.startswith("我家"):
                display_item = "您家" + display_item[2:]
            return {
                "response": f"收到，{display_item}。请问问题严重吗？是否影响正常生活？您也可以直接上传现场照片。",
                "tool_results": [],
                "pending_repair": pending,
                "skip_llm_rewrite": True,
            }

        if step == "collect_description":
            description = user_text.strip()
            if images:
                pending.setdefault("image_urls", []).extend(images)
            if not description or len(description) < 3:
                return {
                    "response": "请再补充一下故障现象，或者上传一张照片，方便师傅判断。",
                    "tool_results": [],
                    "pending_repair": pending,
                    "skip_llm_rewrite": True,
                }
            pending["description"] = description
            # Create the order right away so the worker info is returned in this
            # same turn instead of promising it "later" (previously the order was
            # only created on a separate confirm turn, and the owner never saw it).
            return _create_repair_order_response(db, user_id, pending, user_text)

        if step == "confirm":
            # Kept for compatibility with in-flight conversations that already
            # reached the confirm step; creates the order immediately.
            if images and not pending.get("image_urls"):
                pending.setdefault("image_urls", []).extend(images)
            return _create_repair_order_response(db, user_id, pending, user_text)

    # Fallback for repair-like messages that don't match collection flow.
    if _is_repair_intent(user_text):
        return {
            "response": "您好，如需报修请告诉我‘是什么坏了’，我会一步步帮您创建工单并派单。",
            "tool_results": [],
            "requires_human": False,
            "pending_repair": {"step": "collect_item"},
            "skip_llm_rewrite": True,
        }

    return {
        "response": "抱歉，我不太理解您的维修需求。您可以直接说‘我要报修’。",
        "tool_results": [],
        "requires_human": False,
        "skip_llm_rewrite": True,
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

    llm = get_llm()
    if llm is not None:
        context_items = []
        for n in notices:
            pinned = "[置顶]" if n.get("is_pinned") else ""
            created = _format_notice_time(n.get("created_at"))
            context_items.append(
                f"{pinned}标题：{n.get('title', '无标题')}\n"
                f"日期：{created}\n"
                f"内容：{n.get('content', '')[:400]}"
            )
        prompt = (
            "你是云溪花园小区的 AI 物业助手。请根据以下公告，用自然、口语化的中文回答业主的问题。\n"
            "要求：\n"
            "1. 直接给出答案，先说明有没有相关公告；\n"
            "2. 提及公告标题和发布日期；\n"
            "3. 对置顶公告可优先说明；\n"
            "4. 不要编造公告中没有的信息。\n\n"
            f"业主问题：{user_text}\n\n"
            "公告列表：\n" + "\n---\n".join(context_items) + "\n\n请回答业主。"
        )
        try:
            from langchain_core.messages import HumanMessage, SystemMessage

            answer = llm.invoke([
                SystemMessage(content="你是一位热情的物业客服助手。"),
                HumanMessage(content=prompt),
            ])
            if answer and isinstance(answer.content, str) and answer.content.strip():
                return {
                    "response": answer.content.strip(),
                    "tool_results": [result],
                }
        except Exception:
            # Fall back to deterministic formatting on LLM failure.
            pass

    lines = ["最新公告："]
    for n in notices:
        pinned = "【置顶】" if n.get("is_pinned") else ""
        created = _format_notice_time(n.get("created_at"))
        time_label = f"（{created}）" if created else ""
        lines.append(f"{pinned}{n.get('title', '无标题')}{time_label}\n  {n.get('content', '')}")

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

    result = agent_tools.search_knowledge(db, user_text, top_k=10)
    output = _tool_output(result)
    chunks = output.get("results", [])

    if not chunks:
        msg = output.get("message", "知识库中未找到相关内容。")
        return {
            "response": (
                f"{msg} 建议您联系物业服务中心（021-5896XXXX）确认，"
                "或者告诉我更具体的关键词，我帮您再查。"
            ),
            "tool_results": [result],
        }

    llm = get_llm()
    if llm is not None:
        context_items = []
        # Focus the answer on the top 5 chunks to avoid information overload.
        for idx, chunk in enumerate(chunks[:5], start=1):
            source = chunk.get("source_path", "未知来源")
            content = chunk.get("content", "").replace("\n", " ")
            context_items.append(f"[{idx}] {content}（来源：{source}）")
        prompt = (
            "你是云溪花园小区的 AI 物业助手。请根据知识库检索到的内容，"
            "用自然、口语化的中文回答业主的问题。\n"
            "要求：\n"
            "1. 直接给出结论，把具体的时间、数字、地点、规定等关键信息原样写出来；\n"
            "2. 只回答业主问到的点，不要罗列无关细节，不要展开背景说明；\n"
            "3. 如果知识库内容不够完整，给出最接近的线索，并建议业主联系物业确认；\n"
            "4. 不要编造知识库中没有的信息；\n"
            "5. 回答务必控制在 120 字以内，方便微信/手机阅读。\n\n"
            f"业主问题：{user_text}\n\n"
            "知识库片段：\n" + "\n".join(context_items) + "\n\n请直接回答业主。"
        )
        try:
            from langchain_core.messages import HumanMessage, SystemMessage

            answer = llm.invoke([
                SystemMessage(content="你是一位熟悉小区规定的物业客服助手。"),
                HumanMessage(content=prompt),
            ])
            if answer and isinstance(answer.content, str) and answer.content.strip():
                return {
                    "response": answer.content.strip(),
                    "tool_results": [result],
                }
        except Exception:
            # Fall back to deterministic formatting on LLM failure.
            pass

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
