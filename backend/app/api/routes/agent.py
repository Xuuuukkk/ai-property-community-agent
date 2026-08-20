"""REST API for the AI Agent system."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.agents import run_agent
from app.agents.graph import AgentResult
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/agent", tags=["Agent"])


class AgentChatRequest(BaseModel):
    """Request body for the agent chat endpoint."""

    message: str = Field(..., min_length=1, description="User message in natural language")
    user_id: int | None = Field(None, description="Optional user ID for context")
    conversation_id: str | None = Field(None, description="Optional conversation ID for continuity")
    pending_repair: dict | None = Field(None, description="Internal multi-turn repair collection state")
    pending_issue: dict | None = Field(None, description="Internal multi-turn issue report collection state")


class AgentChatResponse(BaseModel):
    """Response from the agent chat endpoint."""

    conversation_id: str
    intent: str
    response: str
    tool_results: list[dict]
    requires_human: bool = False
    pending_repair: dict | None = None
    pending_issue: dict | None = None


@router.post("/chat", response_model=AgentChatResponse)
def agent_chat(
    payload: AgentChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AgentResult:
    """Send a natural-language message to the AI agent system.

    The agent will classify the intent, route to the appropriate domain agent,
    call business tools, and return a user-friendly response.
    """
    # Owners and workers always act as themselves; only staff/admin may pass a
    # different user_id (e.g. to query a specific owner's context).
    if current_user.role not in ("ADMIN", "PROPERTY_STAFF"):
        payload.user_id = current_user.id

    try:
        result = run_agent(
            payload.message,
            user_id=payload.user_id,
            conversation_id=payload.conversation_id,
            pending_repair=payload.pending_repair,
            pending_issue=payload.pending_issue,
            system_message="你是云溪花园小区的 AI 物业助手，负责帮助业主和物业人员处理报修、上报小区问题、查费、发布公告和咨询。",
            db=db,
        )
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent execution failed: {exc}",
        ) from exc
