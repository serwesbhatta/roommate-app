# backend/app/schemas/user.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    msu_id: int
    msu_email: str
    password: str

# Consider adding response models too
class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    msu_id: int
    msu_email: str
    
    class Config:
        from_attributes = True