"""Tests for the AI Agent system (Phase 5).

These tests use a rule-based classifier so they do not require an external
LLM API key. They verify:
- intent routing
- tool calling
- response formatting
- API endpoint integration
"""

import pytest
from fastapi.testclient import TestClient

from app.agents import run_agent
from app.agents.graph import agent_graph
from app.agents.tools import query_payment_status, query_repair_order
from app.main import app


class TestAgentGraph:
    """Unit-level tests for the LangGraph agent graph."""

    def test_repair_intent_classification(self) -> None:
        result = run_agent("我家厨房漏水了", user_id=1)
        assert result.intent == "repair"

    def test_fee_intent_classification(self) -> None:
        result = run_agent("查一下物业费", user_id=1)
        assert result.intent == "fee"

    def test_notice_query_intent_classification(self) -> None:
        result = run_agent("明天停水维修", user_id=1)
        assert result.intent == "notice_query"

    def test_notice_publish_intent_classification(self) -> None:
        result = run_agent("发布停水通知", user_id=1)
        assert result.intent == "notice_publish"

    def test_knowledge_intent_classification(self) -> None:
        result = run_agent("装修可以施工到几点？", user_id=1)
        assert result.intent == "knowledge"

    def test_unknown_intent(self) -> None:
        result = run_agent("随便聊聊", user_id=1)
        assert result.intent == "unknown"

    def test_graph_compiles(self) -> None:
        # LangGraph compiled graph should expose get_graph()
        assert agent_graph is not None


class TestAgentTools:
    """Tests that agent tools delegate to the service layer correctly."""

    def test_query_repair_order_tool(self, db) -> None:
        result = query_repair_order(db, user_id=1)
        assert result["tool"] == "query_repair_order"
        assert "total" in result["output"]
        assert "orders" in result["output"]

    def test_query_payment_status_tool(self, db) -> None:
        result = query_payment_status(db, user_id=1)
        assert result["tool"] == "query_payment_status"
        assert "total_bills" in result["output"]
        assert "message" in result["output"]


class TestAgentAPI:
    """Integration tests for the /api/agent/chat endpoint."""

    def test_agent_chat_repair(self, client: TestClient) -> None:
        # First turn: agent collects the broken item.
        response = client.post("/api/agent/chat", json={"message": "我要报修", "user_id": 1})
        assert response.status_code == 200
        data = response.json()
        assert data["intent"] == "repair"
        assert "pending_repair" in data
        assert data["pending_repair"]["step"] == "collect_item"

        # Second turn: provide the item, agent asks for description/photo.
        response = client.post(
            "/api/agent/chat",
            json={
                "message": "厨房水龙头漏水",
                "user_id": 1,
                "pending_repair": data["pending_repair"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["pending_repair"]["step"] == "collect_description"

        # Third turn: provide description; order is created and dispatched
        # immediately in this same turn (no separate confirm step anymore).
        response = client.post(
            "/api/agent/chat",
            json={
                "message": "漏水比较严重，已经滴了一地",
                "user_id": 1,
                "pending_repair": data["pending_repair"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["intent"] == "repair"
        assert "工单" in data["response"]
        assert "师傅" in data["response"]
        assert data["pending_repair"] is None

    def test_agent_chat_fee(self, client: TestClient) -> None:
        response = client.post("/api/agent/chat", json={"message": "查物业费", "user_id": 1})
        assert response.status_code == 200
        data = response.json()
        assert data["intent"] == "fee"
        assert "账单" in data["response"]

    def test_agent_chat_knowledge(self, client: TestClient) -> None:
        response = client.post("/api/agent/chat", json={"message": "装修可以施工到几点？", "user_id": 1})
        assert response.status_code == 200
        data = response.json()
        assert data["intent"] == "knowledge"

    def test_agent_chat_requires_message(self, client: TestClient) -> None:
        response = client.post("/api/agent/chat", json={"message": "", "user_id": 1})
        assert response.status_code == 422
