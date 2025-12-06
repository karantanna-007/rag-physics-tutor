# app/ingestion/__init__.py
"""
Document ingestion pipeline for the RAG Physics Tutor.

Flow for each uploaded file:

1. loaders:  Use Unstructured to parse PDFs, DOCX, etc. into text elements.
2. chunking: Split text into manageable chunks with metadata.
3. pipeline: Convert chunks to embeddings, store in Pinecone, and write
             chunk metadata to NeonDB.

This package is used by `app/services/ingestion_service.py`.
"""

from . import loaders, chunking, pipeline  # noqa: F401

__all__ = ["loaders", "chunking", "pipeline"]
