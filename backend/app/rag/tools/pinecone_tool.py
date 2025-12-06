# app/rag/tools/pinecone_tool.py

from functools import lru_cache
from typing import List, Dict, Any

from pinecone import Pinecone
from langchain_core.tools import tool

from app.core.config import settings
from app.rag.embeddings import get_embedding_model

"""
Pinecone tool for the LangChain agent.

Uses the NEW `pinecone` SDK (not pinecone-client).

Exposes one tool:

- pinecone_semantic_search(query: str, top_k: int = 5) -> List[dict]
  Runs a semantic search on the physics document index in Pinecone and
  returns the top_k matches with text + metadata.
"""


@lru_cache
def _get_pinecone_client() -> Pinecone:
    """
    Initialize and cache the Pinecone client.
    """
    if not settings.PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY is not set in environment")

    return Pinecone(api_key=settings.PINECONE_API_KEY)


@lru_cache
def _get_index():
    """
    Get a handle to the configured Pinecone index.
    """
    pc = _get_pinecone_client()
    return pc.Index(settings.PINECONE_INDEX_NAME)


@tool("pinecone_semantic_search", return_direct=False)
def pinecone_semantic_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Semantic search over the Pinecone physics index.

    Args:
        query: Natural-language query (e.g., "Explain Gauss's law").
        top_k: Number of most similar chunks to retrieve.

    Returns:
        A list of dictionaries, each containing:
        - id: vector id
        - score: similarity score
        - text: original text chunk (if stored in metadata)
        - metadata: all metadata associated with the chunk
    """
    embed_model = get_embedding_model()
    query_embedding = embed_model.embed_query(query)

    index = _get_index()
    res = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
    )

    results: List[Dict[str, Any]] = []
    if hasattr(res, "matches"):
        for match in res.matches:
            metadata = match.metadata or {}
            results.append(
                {
                    "id": match.id,
                    "score": match.score,
                    "text": metadata.get("text"),
                    "metadata": metadata,
                }
            )

    return results
