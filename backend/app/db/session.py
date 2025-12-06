# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create SQLAlchemy engine for NeonDB (PostgreSQL)
# Example DATABASE_URL in .env:
# postgresql+psycopg2://user:password@host/db_name
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

# Factory for DB sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
