# from pydantic import BaseModel, Field, field_validator
# from typing import Optional
# from datetime import date

# class RoomBase(BaseModel):
#     room_number: str = Field(..., min_length=1, max_length=50, description="Room number")
#     room_type: str = Field(..., min_length=1, max_length=50, description="Type of room")
#     capacity: int = Field(..., gt=0, description="Maximum number of occupants")
#     current_occupants: int = Field(0, ge=0, description="Current number of occupants")
#     price: float = Field(..., gt=0, description="Room price")
#     is_available: bool = Field(True, description="Room availability status")
#     residence_hall_id: int = Field(..., description="ID of the residence hall")
#     gender_preference: str = Field("any", description="Gender preference for the room")
#     room_status: str = Field("available", description="Current status of the room")
#     lease_end: Optional[date] = Field(None, description="Lease end date")

#     @field_validator('current_occupants')
#     @classmethod
#     def check_occupants(cls, v, info):
#         # In Pydantic V2, we use a different approach to access other fields
#         capacity = info.data.get('capacity')
#         if capacity is not None and v > capacity:
#             raise ValueError('Current occupants cannot exceed room capacity')
#         return v

# class RoomCreate(RoomBase):
#     pass

# class RoomUpdate(BaseModel):
#     room_number: Optional[str] = Field(None, min_length=1, max_length=50)
#     room_type: Optional[str] = Field(None, min_length=1, max_length=50)
#     capacity: Optional[int] = Field(None, gt=0)
#     current_occupants: Optional[int] = Field(None, ge=0)
#     price: Optional[float] = Field(None, gt=0)
#     is_available: Optional[bool] = None
#     residence_hall_id: Optional[int] = None
#     gender_preference: Optional[str] = None
#     room_status: Optional[str] = None
#     lease_end: Optional[date] = None

# class RoomResponse(RoomBase):
#     id: int

#     model_config = {
#         "from_attributes": True
#     }