from sqlalchemy import Column, String, Date, Integer, Numeric
from .database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    msu_id = Column(Integer, unique=True, nullable=False)
    msu_email = Column(String(100), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
