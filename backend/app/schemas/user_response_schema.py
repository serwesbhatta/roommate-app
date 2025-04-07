from pydantic import BaseModel
from typing import List

class SingleUserResponse(BaseModel):
    question_id: int
    selected_option: str

class UserResponseCreate(BaseModel):
    responses: List[SingleUserResponse]
