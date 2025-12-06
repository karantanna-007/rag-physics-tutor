# app/api/v1/routes_files.py
from typing import List

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.file import FileListItem, FileUploadResponse
from app.services import file_service
from app.models.user import User

router = APIRouter(prefix="/files")


@router.get("/", response_model=List[FileListItem])
def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FileListItem]:
    """
    List all uploaded files for the current user.
    """
    files = file_service.list_user_files(db=db, user=current_user)
    return files


@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_files(
    uploaded_files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FileUploadResponse:
    """
    Upload one or more files for the current user.

    - Stores the raw files in the file storage path (e.g., 'uploads/')
    - Saves metadata in the 'files' table
    - (Later) triggers ingestion pipeline: load → split → embed → store in Pinecone
    """
    if not uploaded_files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files uploaded",
        )

    result = await file_service.handle_file_uploads(
        db=db,
        user=current_user,
        files=uploaded_files,
    )
    return result


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a file owned by the current user.

    This should:
    - Remove metadata from the DB
    - Remove any associated chunk_metadata rows
    - (Optionally) Remove corresponding vectors from Pinecone
    - Delete the raw file from storage
    """
    success = file_service.delete_user_file(
        db=db,
        user=current_user,
        file_id=file_id,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found or not owned by the current user",
        )
