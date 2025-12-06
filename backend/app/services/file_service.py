# app/services/file_service.py
import os
from typing import List

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.models.file import File
from app.schemas.file import FileListItem, FileUploadResponse
from app.utils import file_storage
from app.services import ingestion_service


def list_user_files(db: Session, user: User) -> List[FileListItem]:
    """
    Return all files belonging to the given user.
    """
    files = (
        db.query(File)
        .filter(File.user_id == user.id)
        .order_by(File.uploaded_at.desc())
        .all()
    )
    return [FileListItem.model_validate(f) for f in files]


async def handle_file_uploads(
    db: Session,
    user: User,
    files: List[UploadFile],
) -> FileUploadResponse:
    """
    Handle one or more uploads for a user:

    - Save raw files to disk (uploads folder)
    - Create File rows in DB
    - Trigger ingestion pipeline asynchronously (per file)
    """
    uploaded_items: List[FileListItem] = []

    storage_path = settings.FILE_STORAGE_PATH
    os.makedirs(storage_path, exist_ok=True)

    for upload in files:
        # 1) Store file on disk with a unique stored filename
        stored_filename, size_bytes = await file_storage.save_upload_file(
            upload=upload,
            destination_dir=storage_path,
        )

        # 2) Create DB record
        file_record = File(
            user_id=user.id,
            original_filename=upload.filename,
            stored_filename=stored_filename,
            content_type=upload.content_type,
            size_bytes=size_bytes,
        )
        db.add(file_record)
        db.commit()
        db.refresh(file_record)

        # 3) Trigger ingestion pipeline (async / background-ish)
        # Right now we just call it directly (it can be offloaded to background tasks later).
        await ingestion_service.process_uploaded_file(
            db=db,
            file_record=file_record,
            storage_dir=storage_path,
        )

        uploaded_items.append(FileListItem.model_validate(file_record))

    return FileUploadResponse(uploaded=uploaded_items)


def delete_user_file(db: Session, user: User, file_id: int) -> bool:
    """
    Delete a file owned by the current user.

    Steps:
    - Check file ownership
    - Delete chunk metadata rows (via relationship cascade)
    - Remove vectors from Pinecone (handled in ingestion/RAG layer later)
    - Delete raw file from disk
    - Delete metadata row from DB
    """
    file_obj = (
        db.query(File)
        .filter(File.id == file_id, File.user_id == user.id)
        .first()
    )

    if not file_obj:
        return False

    # 1) Delete raw file from disk
    storage_path = settings.FILE_STORAGE_PATH
    file_storage.delete_stored_file(
        stored_filename=file_obj.stored_filename,
        destination_dir=storage_path,
    )

    # 2) TODO (optional): Remove vectors from Pinecone using vector_id in ChunkMetadata.
    #    That logic can live in ingestion_service or rag/vectorstore.

    # 3) Delete from DB (cascade should remove associated chunk_metadata)
    db.delete(file_obj)
    db.commit()

    return True
