# app/tests/test_chat.py
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
    email = f"chatuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "chat_password123"
    name = "Chat User"

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


def test_chat_requires_auth():
    """
    /chat without Authorization header should return 401.
    """
    resp = client.post(
        "/api/v1/chat/",
        json={"message": "Explain Gauss's law"},
    )
    assert resp.status_code == 401


@pytest.mark.skipif(
    not settings.GROQ_API_KEY,
    reason="GROQ_API_KEY not configured; skipping chat integration test.",
)
def test_chat_with_valid_token():
    """
    Basic integration test for /chat when Groq is configured.

    We don't assert on the exact content of the answer,
    only that:
    - request succeeds (status_code 200)
    - response has 'conversation_id' and 'reply'
    """
    token = _create_user_and_get_token()
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.post(
        "/api/v1/chat/",
        json={"message": "Explain Gauss's law with an intuitive example."},
        headers=headers,
    )

    # If RAG/LLM pipeline is configured correctly, expect 200
    assert resp.status_code == 200
    data = resp.json()
    assert "conversation_id" in data
    assert "reply" in data
    assert data["reply"]["role"] == "assistant"
    assert isinstance(data["reply"]["content"], str)
    assert data["reply"]["content"]
