from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from  ..database import Base

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, autoincrement=True)
    option_text = Column(String(300), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    question = relationship("Question", back_populates="options")