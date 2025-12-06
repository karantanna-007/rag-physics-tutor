# app/schemas/file.py
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.common import IDModel


class FileListItem(IDModel, BaseModel):
    """
    Schema for a single file entry in list responses.
    These fields should correspond to your File model columns.
    """
    user_id: int
    original_filename: str
    stored_filename: str
    content_type: Optional[str] = None
    size_bytes: Optional[int] = None
    description: Optional[str] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FileUploadResponse(BaseModel):
    """
    Response after successful upload of one or more files.

    - uploaded: list of FileListItem created
    """
    uploaded: list[FileListItem]
