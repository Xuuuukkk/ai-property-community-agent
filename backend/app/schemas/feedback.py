"""Pydantic schemas for conversation feedback and knowledge gaps."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FeedbackCreate(BaseModel):
    """Owner submits feedback on an AI answer."""

    conversation_id: int | None = Field(None, description="关联对话 ID")
    question: str = Field(..., min_length=1, description="用户问题")
    answer: str = Field(..., min_length=1, description="AI 回答")
    rating: str = Field(..., description="up / down")
    correction: str | None = Field(None, description="纠正内容（可选）")


class FeedbackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    conversation_id: int | None
    question: str
    answer: str
    rating: str
    correction: str | None
    created_at: datetime


class KnowledgeGapResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str
    suggested_answer: str | None
    source: str
    status: str
    created_at: datetime
    resolved_at: datetime | None


class KnowledgeGapListResponse(BaseModel):
    items: list[KnowledgeGapResponse]


class GapApprove(BaseModel):
    """Staff approval payload, optionally overriding the answer."""

    answer: str | None = Field(None, description="审核后的答案（为空则用建议答案）")


class FeedbackStatsResponse(BaseModel):
    total: int
    up: int
    down: int
    down_rate: float
    top_problems: list[dict]
