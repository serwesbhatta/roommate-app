from pydantic import BaseModel
from typing import List
from .option_schema import OptionResponse

class QuestionOptionResponse(BaseModel):
    id: int
    question_text: str
    category :str
    options: List[OptionResponse]

    class Config:
        orm_mode = True