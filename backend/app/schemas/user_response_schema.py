from pydantic import BaseModel
from typing import Optional

class UserResponseBase(BaseModel):
    user_id: int
    question_id: int
    option_id: int

class UserResponseCreate(UserResponseBase):
    pass

class UserResponseUpdate(UserResponseBase):
    option_id: Optional[int]

class UserReponseResponse(UserResponseBase):
    id: int

    class Config:
        orm_mode = True