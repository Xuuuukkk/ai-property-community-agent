"""Data-driven insight extraction and report generation.

The core idea behind the statistics module: numbers aren't the goal — finding
problems is. This module turns raw aggregates into concrete "insights"
(rule-based, deterministic) and, when an LLM is available, assembles them into
a human-readable summary report.
"""

from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.llm import get_llm
from app.models.building import Building
from app.models.fee_bill import FeeBill
from app.models.house import House
from app.models.inspection import InspectionRecord
from app.models.repair_order import RepairOrder
from app.models.worker import Worker
from app.services.stats import get_dashboard_stats

REPAIR_TYPE_LABELS = {
    "water_leak": "漏水",
    "power_trip": "跳闸",
    "wall_seepage": "墙面渗水",
    "elevator_fault": "电梯故障",
    "access_control": "门禁故障",
    "public_facility": "公共设施",
}


def get_insights(db: Session) -> list[dict]:
    """Extract rule-based findings from the data, each with a severity level."""
    stats = get_dashboard_stats(db)
    insights: list[dict] = []

    insights.extend(_repair_type_insights(stats))
    insights.extend(_building_hotspot_insights(db))
    insights.extend(_worker_load_insights(db))
    insights.extend(_inspection_insights(stats))
    insights.extend(_fee_insights(stats))

    return insights


def _repair_type_insights(stats: dict) -> list[dict]:
    by_type = stats["repair"]["by_type"]
    total = stats["repair"]["total"]
    if not by_type or not total:
        return []

    top_type, top_count = max(by_type.items(), key=lambda kv: kv[1])
    ratio = top_count / total
    label = REPAIR_TYPE_LABELS.get(top_type, top_type)

    return [
        {
            "category": "工单",
            "severity": "warning" if ratio >= 0.2 else "info",
            "title": f"{label}报修占比最高",
            "detail": f"{label}类报修 {top_count} 单，占全部 {total} 单的 {round(ratio * 100)}%，"
            f"建议专项排查该类问题是否存在共性原因。",
        }
    ]


def _building_hotspot_insights(db: Session) -> list[dict]:
    rows = (
        db.query(Building.building_no, func.count(RepairOrder.id))
        .join(House, House.building_id == Building.id)
        .join(RepairOrder, RepairOrder.house_id == House.id)
        .group_by(Building.building_no)
        .all()
    )
    if not rows:
        return []

    counts = [c for _, c in rows]
    avg = sum(counts) / len(counts)
    top_building, top_count = max(rows, key=lambda r: r[1])

    if top_count >= avg * 1.5 and top_count >= 5:
        return [
            {
                "category": "设施",
                "severity": "warning",
                "title": f"{top_building}栋报修最频繁",
                "detail": f"{top_building}栋累计报修 {top_count} 次，明显高于平均 {avg:.1f} 次，"
                f"该楼栋设施可能存在老化或系统性问题，建议重点巡检。",
            }
        ]
    return []


def _worker_load_insights(db: Session) -> list[dict]:
    open_statuses = ("CREATED", "ASSIGNED", "PROCESSING")
    rows = (
        db.query(Worker.id, func.count(RepairOrder.id))
        .join(RepairOrder, RepairOrder.worker_id == Worker.id)
        .filter(RepairOrder.status.in_(open_statuses))
        .group_by(Worker.id)
        .all()
    )
    if not rows:
        return []

    max_load = max(c for _, c in rows)
    if max_load >= 5:
        return [
            {
                "category": "人力",
                "severity": "warning",
                "title": "维修工负载不均",
                "detail": f"有维修工当前在途工单达 {max_load} 单，负载偏高，建议均衡派单。",
            }
        ]
    return [
        {
            "category": "人力",
            "severity": "info",
            "title": "维修工负载均衡",
            "detail": f"当前维修工最高在途工单 {max_load} 单，整体负载均衡。",
        }
    ]


def _inspection_insights(stats: dict) -> list[dict]:
    insp = stats["inspection"]
    by_anomaly = {k: v for k, v in insp["by_anomaly"].items() if k != "正常"}
    if not by_anomaly:
        return []

    top_items = sorted(by_anomaly.items(), key=lambda kv: kv[1], reverse=True)
    top_desc = "、".join(f"{k} {v} 次" for k, v in top_items[:2])
    severity = "warning" if insp["anomaly_rate"] >= 0.5 else "info"

    return [
        {
            "category": "巡检",
            "severity": severity,
            "title": "巡检高频异常",
            "detail": f"巡检共发现异常 {insp['anomaly_count']} 次，其中{top_desc}，"
            f"建议加强对应区域的巡查与治理。",
        }
    ]


def _fee_insights(stats: dict) -> list[dict]:
    fee = stats["fee"]
    if fee["overdue_count"] > 0:
        unpaid = round(fee["total_amount"] - fee["paid_amount"], 2)
        return [
            {
                "category": "财务",
                "severity": "warning" if fee["overdue_count"] >= 30 else "info",
                "title": "费用收缴需关注",
                "detail": f"当前 {fee['overdue_count']} 户费用已逾期，未收金额 ¥{unpaid:,.2f}，"
                f"建议安排催缴。",
            }
        ]
    return []


def generate_report(db: Session) -> str:
    """Assemble insights + stats into a natural-language summary report."""
    stats = get_dashboard_stats(db)
    insights = get_insights(db)

    llm = get_llm()
    if llm is None:
        return _rule_based_report(stats, insights)

    prompt = _build_prompt(stats, insights)
    try:
        result = llm.invoke(prompt)
        text = result.content if hasattr(result, "content") else str(result)
        return text.strip()
    except Exception:  # noqa: BLE001 - fall back to rule-based text
        return _rule_based_report(stats, insights)


def _build_prompt(stats: dict, insights: list[dict]) -> str:
    r, f, insp, iss, com = (
        stats["repair"],
        stats["fee"],
        stats["inspection"],
        stats["issue"],
        stats["community"],
    )
    findings = "\n".join(f"- {i['title']}：{i['detail']}" for i in insights)

    return (
        "你是物业数据分析助手。根据下面云溪花园的数据统计和发现的问题，"
        "生成一份简洁的中文「数据洞察总结报告」，分点输出，每点说明：问题、数据依据、改进建议。"
        "语气专业、克制，总字数控制在 250 字以内，不要用标题符号。\n\n"
        f"【核心数据】工单 {r['total']} 单（完成 {r['completed']}，完成率 {round(r['completion_rate'] * 100)}%）；"
        f"费用应收 ¥{f['total_amount']:,.2f}，已收 ¥{f['paid_amount']:,.2f}（收缴率 {round(f['collection_rate'] * 100)}%），逾期 {f['overdue_count']} 户；"
        f"巡检 {insp['total']} 次，异常 {insp['anomaly_count']} 次；业主上报 {iss['total']} 条；"
        f"业主 {com['users']} 户、房屋 {com['houses']} 套、楼栋 {com['buildings']} 栋。\n\n"
        f"【已识别的问题】\n{findings}\n\n请输出报告正文。"
    )


def _rule_based_report(stats: dict, insights: list[dict]) -> str:
    if not insights:
        return "当前各项数据运行平稳，暂未发现需要重点关注的问题。"

    lines = []
    for i in insights:
        sev = {"critical": "【严重】", "warning": "【关注】", "info": "【提示】"}.get(
            i["severity"], ""
        )
        lines.append(f"{sev}{i['title']}：{i['detail']}")
    return "\n".join(lines)
