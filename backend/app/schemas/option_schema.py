from pydantic import BaseModel
from typing import Optional

class OptionBase(BaseModel):
    option_text: str
    question_id: int

class OptionCreate(OptionBase):
    pass

class OptionUpdate(OptionBase):
    option_text: Optional[str]
    question_id: Optional[str]

class OptionResponse(OptionBase):
    id: int

    class Config:
        orm_mode = True