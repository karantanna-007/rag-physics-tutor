# app/api/v1/routes_health.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/health")


class HealthResponse(BaseModel):
    status: str
    detail: str


@router.get("/", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Simple health check endpoint.

    Frontend / Render / monitoring can use this to verify the backend is alive.
    """
    return HealthResponse(status="ok", detail="RAG Physics Tutor backend is running")
