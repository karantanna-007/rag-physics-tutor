# app/tests/test_files.py
import io
import uuid

import pytest
from fastapi.testclient import TestClient

from main import app
from app.core.config import settings

client = TestClient(app)


def _create_user_and_get_token() -> str:
    """
    Helper to:
    - register a unique user
    - return the JWT access token
    """
    email = f"fileuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "file_password123"
    name = "File User"

    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": name,
            "email": email,
            "password": password,
        },
    )
    assert reg_resp.status_code in (200, 201)
    data = reg_resp.json()
    return data["access_token"]


def test_list_files_requires_auth():
    """
    /files without token should return 401.
    """
    resp = client.get("/api/v1/files/")
    assert resp.status_code == 401


@pytest.mark.skipif(
    not settings.PINECONE_API_KEY,
    reason="PINECONE_API_KEY not configured; skipping file upload + ingestion test.",
)
def test_upload_file_and_list():
    """
    Basic integration test for file upload + listing when Pinecone is configured.

    Flow:
    - Create user + token
    - Upload a small fake text file
    - List files and ensure the uploaded one appears
    """
    token = _create_user_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Fake file data
    file_content = b"This is a small physics note about Gauss's law."
    file_like = io.BytesIO(file_content)

    files = {
        "uploaded_files": (
            "gauss_notes.txt",
            file_like,
            "text/plain",
        )
    }

    upload_resp = client.post(
        "/api/v1/files/upload",
        headers=headers,
        files=files,
    )

    # If ingestion is fully configured, expect 201
    assert upload_resp.status_code in (200, 201)
    upload_data = upload_resp.json()
    assert "uploaded" in upload_data
    assert len(upload_data["uploaded"]) >= 1

    # Now list files
    list_resp = client.get("/api/v1/files/", headers=headers)
    assert list_resp.status_code == 200
    files_data = list_resp.json()
    assert isinstance(files_data, list)
    assert len(files_data) >= 1

    # We only assert that at least one file exists; you can tighten assertions later.
