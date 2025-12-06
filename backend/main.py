# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi  # <-- NEW
from fastapi.security import HTTPBearer       # <-- NEW

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.api.v1 import (
    routes_auth,
    routes_chat,
    routes_files,
    routes_health,
)
from app.db.init_db import init_db  # DB init


def create_app() -> FastAPI:
    """
    Application factory for the FastAPI app.
    """
    # Initialize logging configuration
    setup_logging()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )

    # CORS configuration (allow frontend on Vercel + local dev)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ---------------------------
    # Register routers
    # ---------------------------
    app.include_router(
        routes_health.router, prefix=settings.API_V1_STR, tags=["health"]
    )
    app.include_router(
        routes_auth.router, prefix=settings.API_V1_STR, tags=["auth"]
    )
    app.include_router(
        routes_files.router, prefix=settings.API_V1_STR, tags=["files"]
    )
    app.include_router(
        routes_chat.router, prefix=settings.API_V1_STR, tags=["chat"]
    )

    # ----------------------------------------------------
    # STARTUP HOOK — run once when the server boots
    # ----------------------------------------------------
    @app.on_event("startup")
    async def on_startup():
        """
        Runs automatically when FastAPI starts.

        Ensures that:
        - database tables are created
        - DB connection is initialized
        """
        init_db()

    return app


app = create_app()

# =========================================================
# Custom OpenAPI so Swagger shows a plain HTTP Bearer (JWT)
# instead of the confusing OAuth2 password flow.
# =========================================================

# This instance is not strictly required for runtime here,
# but defines the name "HTTPBearer" that we'll use in the docs.
bearer_scheme = HTTPBearer()


def custom_openapi():
    # If already generated, return cached schema
    if app.openapi_schema:
        return app.openapi_schema

    # Generate default schema from routes
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        routes=app.routes,
    )

    components = openapi_schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})

    # Define a simple HTTP Bearer auth scheme (JWT in Authorization header)
    security_schemes["HTTPBearer"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }

    # If an OAuth2PasswordBearer scheme exists from dependencies,
    # remove it from docs to avoid the username/password popup.
    if "OAuth2PasswordBearer" in security_schemes:
        security_schemes.pop("OAuth2PasswordBearer")

    # Rewrite any operation security that referenced OAuth2PasswordBearer
    # to instead reference HTTPBearer, so the new scheme is actually used.
    paths = openapi_schema.get("paths", {}) or {}
    for path_item in paths.values():
        if not isinstance(path_item, dict):
            continue
        for operation in path_item.values():
            if not isinstance(operation, dict):
                continue
            security = operation.get("security", [])
            new_security = []
            for sec in security:
                if "OAuth2PasswordBearer" in sec:
                    new_security.append({"HTTPBearer": []})
                else:
                    new_security.append(sec)
            operation["security"] = new_security

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# Tell FastAPI to use our custom OpenAPI generator
app.openapi = custom_openapi


# For running directly via: python main.py
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
