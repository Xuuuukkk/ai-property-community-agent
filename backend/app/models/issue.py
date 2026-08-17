"""Owner-submitted issue reports (市长信箱 style).

Owners report community problems — public facility faults, complaints, or
spotted issues — with a text description and optional photos. Property staff
then process the report and reply once it is resolved.
"""

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import IssueCategory, IssueStatus

# Community zones (shared with the patrol inspection feature).
ZONES = ["东区", "西区", "南区", "北区"]

# Preset issue locations within a zone.
LOCATIONS = [
    "电梯",
    "公共通道",
    "垃圾投放点",
    "消防通道",
    "楼道",
    "非机动车棚",
    "地下车库",
    "绿化带",
    "单元门/门禁",
    "其他",
]

# Category -> human-readable label (frontend-friendly).
CATEGORY_LABELS = {
    IssueCategory.PUBLIC_FACILITY.value: "公共设施报修",
    IssueCategory.COMPLAINT.value: "意见投诉",
    IssueCategory.REPORT.value: "随手拍问题",
}

# Zone -> candidate assignee user ids (ADMIN accounts). Auto-dispatch picks the
# candidate with the fewest open issues (load balancing), mirroring the repair
# worker dispatch logic. Complaint-only issues without a zone stay unassigned
# for manual triage.
ZONE_ASSIGNEES: dict[str, list[int]] = {
    "东区": [202, 203],  # 丁辉、黄琳
    "西区": [204, 205],  # 周强、魏颖
    "南区": [206, 207],  # 何伟、吕云
    "北区": [208, 209],  # 吴鑫、曹磊
}


class IssueReport(Base):
    """An owner-submitted community issue report."""

    __tablename__ = "issue_report"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Issue category: public_facility / complaint / report.
    category: Mapped[str] = mapped_column(
        String(32), nullable=False, default=IssueCategory.REPORT.value
    )
    # Community zone (东区/西区/南区/北区). Nullable for complaints that are
    # not location-specific.
    zone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    # Concrete location within the zone, one of LOCATIONS.
    location: Mapped[str | None] = mapped_column(String(64), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    # Image paths (reuse the inspection-images storage).
    images: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    # Lifecycle: submitted -> processing -> resolved.
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default=IssueStatus.SUBMITTED.value
    )
    # Property staff (admin) this issue is auto-dispatched to, by zone.
    assignee_id: Mapped[int | None] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"), nullable=True, index=True
    )
    assigned_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=False), nullable=True
    )
    # Property staff's reply, filled once resolved (市长信箱 style).
    reply: Mapped[str | None] = mapped_column(Text, nullable=True)
    replied_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=False), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id], lazy="selectin")
    assignee: Mapped["User | None"] = relationship(
        "User", foreign_keys=[assignee_id], lazy="selectin"
    )

    @property
    def assignee_name(self) -> str | None:
        """Human-readable name of the assigned staff member."""
        if self.assignee is None:
            return None
        return self.assignee.real_name or self.assignee.username
