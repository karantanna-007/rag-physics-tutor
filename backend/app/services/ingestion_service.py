# app/services/ingestion_service.py
import os
import logging
from sqlalchemy.orm import Session

from app.models.file import File
from app.ingestion import pipeline as ingestion_pipeline

logger = logging.getLogger("ingestion_service")


async def process_uploaded_file(
    db: Session,
    file_record: File,
    storage_dir: str,
) -> None:
    """
    Process an uploaded file:

    - Locate the raw file in storage_dir using stored_filename
    - Run the ingestion pipeline:
      - Load text via Unstructured (with OCR if needed)
      - Chunk text
      - Embed with embedding model
      - Store vectors in Pinecone
      - Insert chunk metadata rows in DB

    This function is called from file_service after each successful upload.
    """

    # Build the absolute path to the stored file
    file_path = os.path.join(storage_dir, file_record.stored_filename)

    # Sanity check: file must exist on disk
    if not os.path.exists(file_path):
        logger.error(
            "process_uploaded_file: file not found on disk. "
            "file_id=%s, expected_path=%s",
            getattr(file_record, "id", None),
            file_path,
        )
        return

    logger.info(
        "process_uploaded_file: starting ingestion for file_id=%s, path=%s",
        getattr(file_record, "id", None),
        file_path,
    )

    try:
        await ingestion_pipeline.run_ingestion_for_file(
            db=db,
            file_record=file_record,
            file_path=file_path,
        )
        logger.info(
            "process_uploaded_file: ingestion finished for file_id=%s",
            getattr(file_record, "id", None),
        )
    except Exception as exc:
        # We don't raise further because this runs after upload;
        # failing ingestion should not crash the whole API.
        logger.exception(
            "process_uploaded_file: ingestion failed for file_id=%s, error=%s",
            getattr(file_record, "id", None),
            exc,
        )
