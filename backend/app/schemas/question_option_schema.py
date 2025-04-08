from pydantic import BaseModel
from typing import List

class QuestionOptionResponse(BaseModel):
    id: int
    question_text: str
    category :str
    options: List[str]

    class Config:
        orm_mode = True