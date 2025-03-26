from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from typing import Generator

# Database connection URL
DATABASE_URL = "postgresql://postgres:password@db/roommate_app"

# Create engine with some additional configuration
engine = create_engine(
    DATABASE_URL, 
    echo=True,  # Keep for debugging, consider disabling in production
    pool_pre_ping=True,  # Test connections before using them
    pool_size=10,  # Connection pool size
    max_overflow=20  # Additional connections for peak load
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,  # Disable autocommit
    autoflush=False,  # Disable automatic flush
    bind=engine
)

# Base class for declarative models
class Base(DeclarativeBase):
    pass

# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    """
    Dependency function that provides a database session.
    Ensures proper session management with context manager.
    
    :yield: Database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()