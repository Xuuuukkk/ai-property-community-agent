"""Tools exposed to the AI agents.

Each tool delegates to the existing service layer, preserving the rule:

    Agent -> Tool -> Service -> Repository -> Database
"""

from app.agents.tools.fee_tools import query_house_fee, query_payment_status
from app.agents.tools.issue_tools import create_issue
from app.agents.tools.knowledge_tools import retrieve_document, search_knowledge
from app.agents.tools.notice_tools import generate_notice, list_notices, publish_notice
from app.agents.tools.repair_tools import (
    assign_worker,
    create_repair_order,
    query_repair_order,
    update_repair_status,
)

__all__ = [
    "create_repair_order",
    "query_repair_order",
    "assign_worker",
    "update_repair_status",
    "create_issue",
    "query_house_fee",
    "query_payment_status",
    "generate_notice",
    "list_notices",
    "publish_notice",
    "search_knowledge",
    "retrieve_document",
]
