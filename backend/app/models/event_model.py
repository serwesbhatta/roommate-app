from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), unique=True ,nullable=False)
    description = Column(String(500), nullable=False)
    event_start = Column(DateTime, nullable=False)
    event_end = Column(DateTime, nullable=False)
    location = Column(String(200), nullable=False)
<<<<<<< HEAD
    status = Column(String(50), default="pending", nullable=True)
=======
    status = Column(String(50), default="pending", nullable=False)
>>>>>>> 7fcaf72 (fix: merge conflict:)
    approved_by = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)
    requested_by = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)

    requested_user = relationship("UserProfile", foreign_keys=[requested_by], back_populates="requested_events")
    approved_user = relationship("UserProfile", foreign_keys=[approved_by], back_populates="approved_events")

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    