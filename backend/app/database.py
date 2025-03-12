from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:password@db/roommate_app"

engine = create_engine(DATABASE_URL, echo=True)

Session_Factory = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

def session_factory():
    Base.metadata.create_all(engine)
    return Session_Factory()