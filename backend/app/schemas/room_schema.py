from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field
from .user_schema import AuthUserResponse


# Base Room Schema (shared properties)
class RoomBase(BaseModel):
    room_number: int
    room_type: str
    capacity: int
    price: float
    residence_hall_id: int
    
    
# Schema for creating a new room
class RoomCreate(RoomBase):
    room_number: Optional[int] = None
    room_type: Optional[str] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    room_status: Optional[str] = None
    is_available: Optional[bool] = None
    current_occupants: Optional[int] = None
    lease_end: Optional[date] = None


# Schema for updating a room
class RoomUpdate(BaseModel):
    room_number: Optional[int] = None
    room_type: Optional[str] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    room_status: Optional[str] = None
    is_available: Optional[bool] = None
    current_occupants: Optional[int] = None
    lease_end: Optional[date] = None


# Schema for returning room data
class RoomResponse(RoomBase):
    current_occupants: int
    is_available: bool
    room_status: str
    lease_end: Optional[date] = None
    
    # Occupants information
    auth_users: List[AuthUserResponse] = []
    
    class Config:
        orm_mode = True
        # This allows the schema to work with ORM models
        # It will read the data from the model objects

