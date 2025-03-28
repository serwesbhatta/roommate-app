from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .core.config import Settings

# Use a single, consistent Base
Base = declarative_base()

engine = create_engine(Settings.DATABASE_URL, echo=True)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)