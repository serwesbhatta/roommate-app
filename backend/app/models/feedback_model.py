from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    giver_user_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False)
    receiver_user_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False)    
    rating = Column(Integer, nullable=False)
    feedback_text = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    giver = relationship("UserProfile", foreign_keys=[giver_user_id], back_populates="given_feedbacks")
    receiver = relationship("UserProfile", foreign_keys=[receiver_user_id], back_populates="received_feedbacks")
