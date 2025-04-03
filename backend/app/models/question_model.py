from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_text = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)

    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")
