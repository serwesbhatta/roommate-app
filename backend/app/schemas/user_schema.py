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

    # New optional fields
    age: Optional[int] = None
    gender: Optional[str] = None
    move_in_date: Optional[datetime] = None
    bio: Optional[str] = None
    majors: Optional[str] = None

class AuthUserResponse(BaseModel):
    id: int
    msu_email: str
    role: str
    created_at: datetime
    modified_at: Optional[datetime] = None
    refresh_token_expires_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    is_logged_in: Optional[bool] = None



    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    msu_id: Optional[str] = None
    msu_email: str
    profile_image: Optional[str] = None
    modified_profile_at: Optional[datetime] = None
    
    # New optional fields added to the response model
    age: Optional[int] = None
    gender: Optional[str] = None
    move_in_date: Optional[datetime] = None
    bio: Optional[str] = None
    majors: Optional[str] = None

    last_login: Optional[datetime] = None
    is_logged_in: Optional[bool] = None

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    msu_id: Optional[str] = None
    profile_image: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    move_in_date: Optional[datetime] = None
    bio: Optional[str] = None
    majors: Optional[str] = None

    class Config:
        from_attributes = True

class AuthUserUpdatePwd(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)

class AuthUserUpdate(BaseModel):
    msu_email: str
    password: str = None
    role: str = "user"

class TokenPair(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"

class LogoutResponse(BaseModel):
    detail: str


class CurrentUser(BaseModel):
    user_id: int
    role: str
    msu_email: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    msu_email: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
