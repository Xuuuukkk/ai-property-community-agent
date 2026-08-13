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
        "tool": "generate_notice",
        "input": {
            "title": title,
            "content": content,
            "notice_type": notice_type,
            "publisher_id": publisher_id,
            "is_pinned": is_pinned,
        },
        "output": {
            "title": title,
            "content": content,
            "notice_type": notice_type,
            "publisher_id": publisher_id,
            "is_pinned": is_pinned,
            "status": "DRAFT",
            "message": "公告草稿已生成，等待人工审核后发布",
        },
    }


def list_notices(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 10,
    status: str = "PUBLISHED",
) -> dict:
    """List published community notices."""
    notices, total = notice_service.list_notices(
        db, page=page, page_size=page_size, status=status
    )
    items = [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "notice_type": n.notice_type,
            "status": n.status,
            "is_pinned": n.is_pinned,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notices
    ]
    return {
        "tool": "list_notices",
        "input": {"page": page, "page_size": page_size, "status": status},
        "output": {
            "notices": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "message": f"找到 {total} 条公告" if total else "暂无公告",
        },
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
        "tool": "publish_notice",
        "input": {
            "title": title,
            "content": content,
            "publisher_id": publisher_id,
            "notice_type": notice_type,
            "is_pinned": is_pinned,
        },
        "output": {
            "notice_id": notice.id,
            "title": notice.title,
            "status": notice.status,
            "message": f"公告《{notice.title}》已发布",
        },
    }
