# app/ingestion/pipeline.py
from typing import List

import logging
from sqlalchemy.orm import Session
from langchain_core.documents import Document

from app.models.file import File
from app.models.chunk_metadata import ChunkMetadata
from app.rag.embeddings import get_embedding_model
from app.rag.vectorstore import get_vectorstore
from app.ingestion.loaders import load_file_to_elements
from app.ingestion.chunking import elements_to_documents
from app.utils.ids import generate_vector_id  # implemented in utils/ids.py

"""
Ingestion pipeline.

Given an uploaded file, we:

1. Load it via Unstructured → elements  (app/ingestion/loaders.py)
   - This now supports OCR for scanned PDFs when Poppler + Tesseract are installed.
2. Turn elements into chunks (LangChain Documents)
3. Create embeddings for each chunk
4. Store embeddings + metadata in Pinecone
5. Record vector IDs + metadata in the chunk_metadata table
"""

logger = logging.getLogger("ingestion")


async def run_ingestion_for_file(
    db: Session,
    file_record: File,
    file_path: str,
) -> None:
    """
    Run the full ingestion pipeline for a single file.

    - db:          SQLAlchemy session
    - file_record: File model instance
    - file_path:   Path on disk to the raw file
    """
    logger.info(
        "Starting ingestion for file_id=%s, path=%s",
        getattr(file_record, "id", None),
        file_path,
    )

    # ------------------------------------------------------------------
    # 1) Load file into elements (Unstructured + OCR if needed)
    # ------------------------------------------------------------------
    try:
        elements = load_file_to_elements(
            file_path=file_path,
            content_type=file_record.content_type,
        )
    except Exception as exc:
        logger.exception("Failed to load file into elements: %s", exc)
        return

    if not elements:
        logger.warning(
            "No elements extracted for file_id=%s; skipping ingestion.",
            file_record.id,
        )
        return

    # ------------------------------------------------------------------
    # 2) Convert elements into chunked Documents with metadata
    # ------------------------------------------------------------------
    base_metadata = {
        "file_id": file_record.id,
        "file_name": file_record.original_filename,
        "stored_filename": file_record.stored_filename,
    }

    try:
        docs: List[Document] = elements_to_documents(
            elements=elements,
            base_metadata=base_metadata,
            chunk_size=800,
            chunk_overlap=200,
        )
    except Exception as exc:
        logger.exception("Failed to convert elements to documents: %s", exc)
        return

    if not docs:
        logger.warning(
            "No chunked documents produced for file_id=%s; nothing to index.",
            file_record.id,
        )
        return

    # ------------------------------------------------------------------
    # 3) Initialize embedding model + vectorstore (Pinecone)
    #    get_embedding_model() is lru_cached, so model loads only once.
    # ------------------------------------------------------------------
    try:
        embedding_model = get_embedding_model()  # noqa: F841  (forces model load)
        vectorstore = get_vectorstore()
    except Exception as exc:
        logger.exception("Failed to initialize embeddings/vectorstore: %s", exc)
        return

    # ------------------------------------------------------------------
    # 4) Generate stable vector IDs for each document
    # ------------------------------------------------------------------
    vector_ids: List[str] = [generate_vector_id() for _ in docs]

    # ------------------------------------------------------------------
    # 5) Add documents to vectorstore with IDs (batched for performance)
    # ------------------------------------------------------------------
    try:
        batch_size = 64  # adjust if you want larger/smaller batches
        for start in range(0, len(docs), batch_size):
            end = start + batch_size
            batch_docs = docs[start:end]
            batch_ids = vector_ids[start:end]
            vectorstore.add_documents(documents=batch_docs, ids=batch_ids)
    except Exception as exc:
        logger.exception("Failed while adding documents to vectorstore: %s", exc)
        return

    # ------------------------------------------------------------------
    # 6) Create chunk metadata rows in DB
    # ------------------------------------------------------------------
    chunk_rows: List[ChunkMetadata] = []

    for vid, doc in zip(vector_ids, docs):
        md = doc.metadata or {}
        chunk_rows.append(
            ChunkMetadata(
                file_id=file_record.id,
                vector_id=vid,
                page_number=md.get("page_number"),
                topic=md.get("topic"),             # may be None for now
                difficulty=md.get("difficulty"),   # may be None for now
            )
        )

    if not chunk_rows:
        logger.warning(
            "No chunk metadata rows created for file_id=%s; this is unusual.",
            file_record.id,
        )
        return

    try:
        db.add_all(chunk_rows)
        db.commit()
        logger.info(
            "Ingestion complete for file_id=%s. Chunks stored: %d",
            file_record.id,
            len(chunk_rows),
        )
    except Exception as exc:
        logger.exception("Failed to commit chunk metadata to DB: %s", exc)
        db.rollback()
