# app/utils/ids.py
import uuid
from typing import Optional


"""
ID generation utilities.

We use UUID4-based strings for vector IDs and stored filenames.
"""


def generate_vector_id(prefix: Optional[str] = None) -> str:
    """
    Generate a unique ID suitable for use as a Pinecone vector ID.

    Example:
    - "vec_7f9e4c5b8a0647a2a4c5b2af0e3b2da1"
    """
    base = uuid.uuid4().hex
    if prefix:
        return f"{prefix}_{base}"
    return f"vec_{base}"


def generate_file_name(extension: str = "") -> str:
    """
    Generate a unique filename for storing uploaded files.

    Example:
    - "file_3c4b1a2f8d9e4ffa9d5a6b8c7e1f2a3b.pdf"
    """
    base = uuid.uuid4().hex
    ext = extension if extension.startswith(".") or extension == "" else f".{extension}"
    return f"file_{base}{ext}"
