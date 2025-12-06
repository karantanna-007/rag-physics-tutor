# app/utils/file_storage.py
import os
from typing import Tuple

from fastapi import UploadFile

from app.utils.ids import generate_file_name


"""
File storage utilities.

Right now we store files on the local filesystem (e.g., 'uploads/' folder).
Later, you can swap this for S3, Google Cloud Storage, etc. without
changing the higher-level services.
"""


async def save_upload_file(
    upload: UploadFile,
    destination_dir: str,
) -> Tuple[str, int]:
    """
    Save an uploaded file to the destination directory with a unique filename.

    Returns:
    - stored_filename: the name we used on disk (e.g., a UUID with extension)
    - size_bytes:      number of bytes written
    """
    os.makedirs(destination_dir, exist_ok=True)

    # Derive an extension from the original filename if present
    original_name = upload.filename or "uploaded_file"
    _, ext = os.path.splitext(original_name)
    stored_filename = generate_file_name(extension=ext)

    destination_path = os.path.join(destination_dir, stored_filename)

    size_bytes = 0
    # Read and write in chunks to avoid loading the entire file in memory
    with open(destination_path, "wb") as out_file:
        while True:
            chunk = await upload.read(1024 * 1024)  # 1 MB per chunk
            if not chunk:
                break
            size_bytes += len(chunk)
            out_file.write(chunk)

    # Reset file pointer (if caller wants to read again; not needed here)
    await upload.close()

    return stored_filename, size_bytes


def delete_stored_file(
    stored_filename: str,
    destination_dir: str,
) -> None:
    """
    Delete a stored file from disk if it exists.
    """
    path = os.path.join(destination_dir, stored_filename)
    if os.path.exists(path):
        try:
            os.remove(path)
        except OSError:
            # We silently ignore deletion errors; you could log them instead.
            pass
