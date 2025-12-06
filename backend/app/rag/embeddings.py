# app/rag/embeddings.py

from functools import lru_cache
from langchain_community.embeddings import HuggingFaceEmbeddings

"""
Embedding model wrapper.

Updated to use a 768-dimensional model to match the Pinecone index.
We now use:
    - "sentence-transformers/all-mpnet-base-v2"
This avoids the dimension mismatch error.
"""


@lru_cache
def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Return a singleton HuggingFaceEmbeddings instance.

    Model: "sentence-transformers/all-mpnet-base-v2"
    Dimension: 768 (matches Pinecone index)
    """
    model_name = "sentence-transformers/all-mpnet-base-v2"
    return HuggingFaceEmbeddings(model_name=model_name)
