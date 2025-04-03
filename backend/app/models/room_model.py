from sqlalchemy import Column, String, Date, Integer, Boolean, ForeignKey, Float, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class Room(Base):
    __tablename__ = "rooms"

    room_number = Column(Integer, nullable=False)

    # Foreign Key relationships
    residence_hall_id = Column(Integer, ForeignKey("residence_halls.id"))

    __table_args__ = (
        PrimaryKeyConstraint("room_number", "residence_hall_id"),
    )

    room_type = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupants = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)

    # Realtionship with residence_hall
    residence_hall = relationship("ResidenceHall", back_populates="rooms")

    # For occupants in a room
    auth_users = relationship("UserProfile", back_populates="room")

    room_status = Column(String(20), default="available")
    lease_end = Column(Date, default="N/A")
