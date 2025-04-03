from sqlalchemy import Column, Integer, ForeignKey 
from sqlalchemy.orm import relationship
from ..database import Base

class UserResponse(Base):
    __tablename__ = "user_responses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", nullable=False))
    option_id = Column(Integer, ForeignKey("options.id"), nullable=False)

    user = relationship("AuthUser", back_populates="responses")
    question = relationship("Question")
    option = relationship("Option")