from sqlalchemy import Column, String, Date, Integer, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(String(50), nullable=False)
    room_type = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupants = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)

    # Foreign Key relationships
    residence_hall_id = Column(Integer, ForeignKey("residence_halls.id"))
    residence_hall = relationship("ResidenceHall", back_populates="rooms")

    gender_preference = Column(String(10), default="any")
    room_status = Column(String(20), default="available")
    lease_end = Column(Date, default="N/A")
