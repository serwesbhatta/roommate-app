from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AuthUserCreate(BaseModel):
    msu_email: str
    password: str
    role: str = "user"

class LoginUser(BaseModel):
    msu_email: str
    password: str

class UserProfileCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    msu_id: str = Field(..., min_length=1, max_length=50)
    msu_email: str
    profile_image: Optional[str] = None


class AuthUserResponse(BaseModel):
    id: int
    msu_email: str
    role: str
    created_at: datetime
    modified_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    msu_id: str
    msu_email: str
    profile_image: Optional[str] = None
    modified_at: Optional[datetime] = None

    class Config:
        from_attributes = True

