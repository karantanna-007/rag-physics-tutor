# app/rag/vectorstore.py

from functools import lru_cache

from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore

from app.core.config import settings
from app.rag.embeddings import get_embedding_model

"""
Pinecone-based vector store (new SDK).

This module initializes Pinecone using the new `pinecone` package and exposes:

- get_vectorstore(): a LangChain PineconeVectorStore wrapping the Pinecone index
- get_retriever(k): a retriever that fetches top-k relevant chunks
"""


@lru_cache
def _get_pinecone_client() -> Pinecone:
    """
    Initialize and cache the Pinecone client (new SDK).
    """
    if not settings.PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY is not set in environment")

    # New style client creation
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    return pc


@lru_cache
def get_vectorstore() -> PineconeVectorStore:
    """
    Return a singleton LangChain PineconeVectorStore instance,
    built on an existing Pinecone index.

    Assumes the index already exists in your Pinecone project.
    """
    pc = _get_pinecone_client()

    # Get handle to existing index
    index = pc.Index(settings.PINECONE_INDEX_NAME)

    # Our embedding model (sentence-transformers / Groq embeddings wrapper)
    embed_model = get_embedding_model()

    # langchain-pinecone integration:
    # PineconeVectorStore(index=index, embedding=embed_model)
    vectorstore = PineconeVectorStore(index=index, embedding=embed_model)
    return vectorstore


def get_retriever(k: int = 5):
    """
    Return a retriever that fetches the top-k most similar chunks.

    Later we can extend this with filters, metadata, etc.
    """
    vs = get_vectorstore()
    return vs.as_retriever(search_kwargs={"k": k})
