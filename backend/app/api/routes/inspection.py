"""Automated patrol inspection API endpoints."""

import mimetypes
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.paths import REPO_ROOT
from app.core.security import get_current_user
from app.models.inspection import InspectionRecord
from app.models.user import User
from app.schemas.common import PageInfo
from app.schemas.inspection import (
    CameraCreate,
    CameraListResponse,
    CameraResponse,
    InspectionRecordListResponse,
    InspectionRecordResponse,
    RunInspectionResponse,
)
from app.services.inspection import inspection_service

router = APIRouter(prefix="/inspection", tags=["inspection"])

_STAFF_ROLES = ("ADMIN", "PROPERTY_STAFF")


@router.get("/cameras", response_model=CameraListResponse)
def list_cameras(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CameraListResponse:
    """List all monitored points (staff/admin)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return CameraListResponse(items=inspection_service.list_cameras(db))


@router.post("/cameras", response_model=CameraResponse, status_code=201)
def create_camera(
    payload: CameraCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CameraResponse:
    """Create a new monitored point (admin only)."""
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return inspection_service.create_camera(db, payload=payload)


@router.get("/records", response_model=InspectionRecordListResponse)
def list_records(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    camera_id: int | None = Query(None, description="Filter by monitored point"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InspectionRecordListResponse:
    """Return a paginated list of inspection records (staff/admin)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    items, total = inspection_service.list_records(
        db, page=page, page_size=page_size, camera_id=camera_id
    )
    pages = (total + page_size - 1) // page_size
    return InspectionRecordListResponse(
        items=items,
        pagination=PageInfo(page=page, page_size=page_size, total=total, pages=pages),
    )


@router.post("/cameras/{camera_id}/run", response_model=RunInspectionResponse)
def run_inspection(
    camera_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RunInspectionResponse:
    """Manually trigger an inspection for a single monitored point."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    camera = inspection_service.get_camera(db, camera_id)
    record = inspection_service.run_inspection(db, camera)
    return RunInspectionResponse(record=InspectionRecordResponse.model_validate(record))


@router.get("/records/{record_id}/image")
def get_record_image(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    """Return the captured screenshot for an inspection record (staff/admin)."""
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    record = db.get(InspectionRecord, record_id)
    if not record or not record.image_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    # image_path is stored relative to the repository root.
    path = Path(record.image_path)
    if not path.is_absolute():
        path = REPO_ROOT / path
    if not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image file missing")

    media_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return FileResponse(path, media_type=media_type)

