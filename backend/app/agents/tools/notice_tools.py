"""Notice tools exposed to the Notice Agent."""

from sqlalchemy.orm import Session

from app.schemas.notice import NoticeCreate
from app.services.notice import notice_service


def generate_notice(
    *,
    title: str,
    content: str,
    notice_type: str = "facility_notice",
    publisher_id: int = 1,
    is_pinned: bool = False,
) -> dict:
    """Generate a notice draft without persisting it.

    This satisfies the human-in-the-loop requirement: the agent can draft a
    notice, but publish_notice must be called explicitly to persist it.
    """
    return {
        "title": title,
        "content": content,
        "notice_type": notice_type,
        "publisher_id": publisher_id,
        "is_pinned": is_pinned,
        "status": "DRAFT",
        "message": "公告草稿已生成，等待人工审核后发布",
    }


def publish_notice(db: Session, *, title: str, content: str, publisher_id: int, notice_type: str = "facility_notice", is_pinned: bool = False) -> dict:
    """Publish a community notice."""
    payload = NoticeCreate(
        title=title,
        content=content,
        publisher_id=publisher_id,
        notice_type=notice_type,
        is_pinned=is_pinned,
    )
    notice = notice_service.create_notice(db, payload=payload)
    return {
        "notice_id": notice.id,
        "title": notice.title,
        "status": notice.status,
        "message": f"公告《{notice.title}》已发布",
    }
