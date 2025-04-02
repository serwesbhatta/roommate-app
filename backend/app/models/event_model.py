from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), unique=True ,nullable=False)
    description = Column(String(500), nullable=False)
    date = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    approved_by = Column(Integer, ForeignKey("auth_users.id"), nullable=True)
    requested_by = Column(Integer, ForeignKey("auth_users.id"), nullable=True)

    requested_user = relationship("AuthUser", foreign_keys=[requested_by], back_populates="requested_events")
    approved_user = relationship("AuthUser", foreign_keys=[approved_by], back_populates="approved_events")

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    