from pydantic import BaseModel
from typing import Optional

class QuestionBase(BaseModel):
    question_text: str
    category: str

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(QuestionBase):
    question_text: Optional[str]
    category: Optional[str]

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        orm_mode = True