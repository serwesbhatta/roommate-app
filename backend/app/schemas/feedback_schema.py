from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

class FeedbackBase(BaseModel):
    rating: int
    receiver_user_id: int

class FeedbackCreateRequest(FeedbackBase):
    feedback_text: Optional[str] = None

class FeedbackCreate(FeedbackCreateRequest):
    giver_user_id: int

class FeedbackUpdate(FeedbackBase):
    rating: Optional[int] = None
    feedback: Optional[str] = None
    receiver_user_id: int
    updated_at: Optional[datetime] = datetime.now(timezone.utc)

class FeedbackResponse(FeedbackBase):
    id: int
    giver_user_id: int
    feedback_text: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
