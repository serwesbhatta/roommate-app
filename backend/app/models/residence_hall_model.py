from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from ..database import Base

class ResidenceHall(Base):
    __tablename__ = "residence_halls"

    id  = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    address = Column(String(500), nullable=False)
    amenities = Column(Text)

    rooms = relationship("Room", back_populates="residence_hall")