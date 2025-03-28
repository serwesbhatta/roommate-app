from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from typing import Generator
from core.config import Settings  # Assuming you have a Settings class

# Create engine with robust configuration
engine = create_engine(
    Settings.DATABASE_URL,  # Use the Settings class for the URL
    echo=False,  # Disable echo in production
    pool_pre_ping=True,  # Test connections before using them
    pool_size=10,  # Connection pool size
    max_overflow=20  # Additional connections for peak load
)

# Base class for declarative models
class Base(DeclarativeBase):
    pass

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,  # Disable autocommit
    autoflush=False,  # Disable automatic flush
    bind=engine
)

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

def create_tables():
    """
    Create all tables defined in the models.
    """
    Base.metadata.create_all(bind=engine)