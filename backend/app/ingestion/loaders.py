# app/ingestion/loaders.py
from typing import Any, List, Optional
import os

import pytesseract
from unstructured.partition.auto import partition

"""
File loaders using Unstructured.io.

Given a file path (PDF, DOCX, etc.), we extract a list of "elements".
Each element typically has:
- .text:      the text content
- .metadata:  additional info (page number, section, etc.)

We keep things simple and let the chunking step convert these elements
into LangChain Documents.

This module is also where we hook up Tesseract OCR so that
image-based / scanned PDFs can be processed.
"""

# ---------------------------------------------------------------------------
# Configure Tesseract path (Windows)
# ---------------------------------------------------------------------------
# Unstructured uses pdf2image + Tesseract under the hood when OCR is needed.
# We point pytesseract to the installed Tesseract binary so everything agrees.
#
# If you installed Tesseract in a different location, update TESSERACT_PATH.
# ---------------------------------------------------------------------------
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
else:
    # Not fatal: if this path is wrong but Tesseract is still on PATH,
    # unstructured may still work. This is just an extra safety.
    # You can replace this with a logger.warning if you have logging here.
    print(
        "[loaders] Warning: Tesseract not found at "
        f"{TESSERACT_PATH}. If OCR fails, check this path."
    )


def load_file_to_elements(
    file_path: str,
    content_type: Optional[str] = None,
) -> List[Any]:
    """
    Load a file from disk and parse it into Unstructured elements.

    - file_path: absolute or relative path to the file
    - content_type: optional MIME type (not required for partition)

    Returns a list of elements. Each element has at least `.text`.

    Notes on OCR:
    - For normal text-based PDFs / docs, Unstructured will just extract text.
    - For scanned/image PDFs, Unstructured may call Tesseract (via pdf2image).
      We pass `ocr_languages="eng"` so English OCR is enabled when needed.
    """
    # Decide when to enable OCR-related options (PDFs & images).
    ext = os.path.splitext(file_path)[1].lower()

    partition_kwargs = {}

    if ext in {".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}:
        # Enable English OCR when necessary; Unstructured itself decides
        # whether OCR is actually used (e.g. for scanned PDFs).
        partition_kwargs["ocr_languages"] = "eng"

    # You could also tune strategy here later (e.g. "hi_res" / "fast")
    # via partition_kwargs["strategy"] = "auto" / "hi_res" / "ocr_only"

    elements = partition(filename=file_path, **partition_kwargs)
    return elements
