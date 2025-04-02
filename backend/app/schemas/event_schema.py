from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

class EventBase(BaseModel):
    title: str
    description: str
    datetime: datetime

class EventCreate(EventBase):
    requested_by: int

class EventUpdate(EventBase):
    title: Optional[str]
    description: Optional[str]
    date: Optional[datetime]
    status: Optional[str]
    approved_by: Optional[int]
    updated_at: Optional[datetime] = datetime.now(timezone.utc)

class EventResponse(EventBase):
    id: int
    status: str
    approved_by: int
    requested_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True