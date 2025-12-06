# app/core/config.py
import json
from typing import List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ---------------------------------------------------------
    # Basic app configuration
    # ---------------------------------------------------------
    PROJECT_NAME: str = "RAG Physics Tutor Backend"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    ENVIRONMENT: str = "local"
    DEBUG: bool = True

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return []

    # ---------------------------------------------------------
    # Database
    # ---------------------------------------------------------
    DATABASE_URL: str

    # ---------------------------------------------------------
    # JWT
    # ---------------------------------------------------------
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ---------------------------------------------------------
    # LLM / RAG (GROQ + Pinecone)
    # ---------------------------------------------------------
    GROQ_API_KEY: Optional[str] = None
    
    # ⭐ UPDATED MODEL
    GROQ_MODEL_NAME: str = "llama-3.3-70b-versatile"

    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: Optional[str] = None
    PINECONE_INDEX_NAME: str = "rag-physics-tutor"

    TAVILY_API_KEY: Optional[str] = None

    # ---------------------------------------------------------
    # File Upload Storage
    # ---------------------------------------------------------
    FILE_STORAGE_PATH: str = "uploads"

    # ---------------------------------------------------------
    # Logging
    # ---------------------------------------------------------
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
