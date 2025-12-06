# app/tests/__init__.py
"""
Test suite for the RAG Physics Tutor backend.

These tests are basic integration-style checks that call the FastAPI app
directly using TestClient.

To run the tests:

    cd backend
    pytest

Note:
- Some tests are conditionally skipped if external services
  (Groq, Pinecone, etc.) are not configured.
"""
