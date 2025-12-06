# app/ingestion/chunking.py
from typing import Any, Dict, List, Optional

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

"""
Chunking logic.

We convert Unstructured elements into LangChain Documents and then
split them into smaller chunks suitable for embeddings and vector search.
"""


def elements_to_documents(
    elements: List[Any],
    base_metadata: Optional[Dict[str, Any]] = None,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> List[Document]:
    """
    Convert Unstructured elements into LangChain Documents, then split
    them into chunks.

    - elements:       list returned by loaders.load_file_to_elements()
    - base_metadata:  common metadata to apply to all chunks
                      (e.g., file_id, file_name)
    - chunk_size:     maximum characters per chunk
    - chunk_overlap:  overlap between chunks to preserve context

    Returns a list of Document objects.
    """
    if base_metadata is None:
        base_metadata = {}

    texts: List[str] = []
    metadatas: List[Dict[str, Any]] = []

    for el in elements:
        text = getattr(el, "text", None)
        if not text:
            continue

        # Extract page number if available
        element_metadata = getattr(el, "metadata", None)
        page_number = None
        if element_metadata is not None:
            page_number = getattr(element_metadata, "page_number", None)

        md = dict(base_metadata)
        if page_number is not None:
            md["page_number"] = page_number

        texts.append(text)
        metadatas.append(md)

    if not texts:
        return []

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )

    docs: List[Document] = splitter.create_documents(
        texts=texts,
        metadatas=metadatas,
    )
    return docs
