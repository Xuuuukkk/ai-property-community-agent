"""REST API for the AI Agent system."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.agents import run_agent
from app.agents.graph import AgentResult
from app.core.database import get_db

router = APIRouter(prefix="/agent", tags=["Agent"])


class AgentChatRequest(BaseModel):
    """Request body for the agent chat endpoint."""

    message: str = Field(..., min_length=1, description="User message in natural language")
    user_id: int | None = Field(None, description="Optional user ID for context")
    conversation_id: str | None = Field(None, description="Optional conversation ID for continuity")


class AgentChatResponse(BaseModel):
    """Response from the agent chat endpoint."""

    conversation_id: str
    intent: str
    response: str
    tool_results: list[dict]
    requires_human: bool = False


@router.post("/chat", response_model=AgentChatResponse)
def agent_chat(
    payload: AgentChatRequest,
    db: Session = Depends(get_db),
) -> AgentResult:
    """Send a natural-language message to the AI agent system.

    The agent will classify the intent, route to the appropriate domain agent,
    call business tools, and return a user-friendly response.
    """
    try:
        result = run_agent(
            payload.message,
            user_id=payload.user_id,
            conversation_id=payload.conversation_id,
            system_message="你是云溪花园小区的 AI 物业助手，负责帮助业主和物业人员处理报修、查费、发布公告和咨询。",
            db=db,
        )
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent execution failed: {exc}",
        ) from exc
