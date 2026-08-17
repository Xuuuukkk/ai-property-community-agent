"""SQLAlchemy ORM models for the property community agent backend."""

from app.core.database import Base
from app.models.building import Building
from app.models.community import Community
from app.models.conversation import AgentTrace, Conversation, Message
from app.models.fee_bill import FeeBill
from app.models.feedback import KnowledgeGap, MessageFeedback
from app.models.house import House
from app.models.house_binding import HouseBinding
from app.models.inspection import InspectionCamera, InspectionRecord
from app.models.issue import IssueReport
from app.models.knowledge import KnowledgeChunk, KnowledgeDocument
from app.models.notice import Notice
from app.models.notification import Notification
from app.models.repair_order import RepairOrder
from app.models.repair_record import RepairRecord
from app.models.user import User
from app.models.worker import Worker

__all__ = [
    "Base",
    "Community",
    "Building",
    "House",
    "User",
    "HouseBinding",
    "Worker",
    "RepairOrder",
    "RepairRecord",
    "FeeBill",
    "MessageFeedback",
    "KnowledgeGap",
    "Notice",
    "Notification",
    "InspectionCamera",
    "InspectionRecord",
    "IssueReport",
    "KnowledgeDocument",
    "KnowledgeChunk",
    "Conversation",
    "Message",
    "AgentTrace",
]
