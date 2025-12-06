# app/tests/test_auth.py
import uuid

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def _unique_email() -> str:
    return f"testuser_{uuid.uuid4().hex[:8]}@example.com"


def test_health_endpoint_works():
    """
    Simple sanity check: /api/v1/health should return status=ok.
    """
    resp = client.get("/api/v1/health/")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "ok"


def test_register_and_login_flow():
    """
    Verify that:
    - We can register a new user
    - We can then log in with the same credentials
    - Both responses contain an access_token
    """
    email = _unique_email()
    password = "testpassword123"
    name = "Test User"

    # Register
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "name": name,
            "email": email,
            "password": password,
        },
    )
    assert reg_resp.status_code in (200, 201)
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email

    # Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data
    assert login_data["user"]["email"] == email


def test_me_requires_auth():
    """
    /auth/me without token should be 401.
    """
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
