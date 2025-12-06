# app/db/init_db.py
from sqlalchemy.orm import Session

from app.db.base import Base  # This already imports all models
from app.db.session import engine


def init_db() -> None:
    """
    Initialize the database.

    - Ensures all tables defined on Base.metadata are created.
    - You can also extend this function to seed initial data.
    """
    # Create all tables (no-op if tables already exist)
    Base.metadata.create_all(bind=engine)

    # If you want to seed data (admin user, default topics, etc.),
    # you can uncomment and implement _seed_initial_data.
    # with Session(engine) as db:
    #     _seed_initial_data(db)


def _seed_initial_data(db: Session) -> None:
    """
    Seed initial data into the database (optional).

    Example ideas:
    - Create an admin user
    - Insert some default physics topics or formulas

    Right now we leave this empty, but it's ready for future use.
    """
    # Example (once you want seeding):
    # from app.models.user import User
    # from app.core.security import get_password_hash
    #
    # admin_email = "admin@example.com"
    # admin = db.query(User).filter(User.email == admin_email).first()
    # if not admin:
    #     new_admin = User(
    #         name="Admin",
    #         email=admin_email,
    #         password_hash=get_password_hash("admin123"),
    #         role="admin",
    #     )
    #     db.add(new_admin)
    #     db.commit()
    #     db.refresh(new_admin)
    pass
