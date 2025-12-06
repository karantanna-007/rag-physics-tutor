# app/rag/__init__.py
"""
RAG (Retrieval-Augmented Generation) layer for the Physics Tutor backend.

This package defines:

- embeddings:   Embedding model wrapper used for both ingestion and retrieval.
- vectorstore:  Pinecone-based vector store + retriever for local documents.
- retrievers:   High-level retrieval logic (local docs + SQL + web).
- agent:        Main RAG agent that orchestrates context retrieval + Groq LLM.
- tools:        Individual tools for vector retrieval, Tavily web search, and SQL.
"""

from . import embeddings, vectorstore, retrievers, agent  # noqa: F401

__all__ = ["embeddings", "vectorstore", "retrievers", "agent"]
