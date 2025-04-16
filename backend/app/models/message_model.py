from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"))
    receiver_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # sender = relationship("UserProfile", foreign_keys="Message.sender_id", backref="sent_messages")
    # receiver = relationship("UserProfile", foreign_keys="Message.receiver_id", backref="received_messages")