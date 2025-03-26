from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """
    Base Pydantic model for shared user fields
    """
    first_name: str
    last_name: str
    msu_id: int
    msu_email: str

class UserCreate(UserBase):
    """
    Pydantic model for creating a new user
    """
    password: str

class UserUpdate(BaseModel):
    """
    Pydantic model for updating user information
    """
    first_name: Optional[str]
    last_name: Optional[str]
    msu_email: Optional[str] = None

class UserResponse(UserBase):
    """
    Pydantic model for API response
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True