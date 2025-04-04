from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

class EventBase(BaseModel):
    title: str
    description: str
    event_start: datetime
    event_end: datetime
    location: str

class EventCreate(EventBase):
    requested_by: int

class EventUpdate(EventBase):
    title: Optional[str]
    description: Optional[str]
    date: Optional[datetime]
    event_start: Optional[datetime]
    event_end: Optional[datetime]
    location: Optional[str]
    status: Optional[str]
    approved_by: Optional[int]
    updated_at: Optional[datetime] = datetime.now(timezone.utc)

class EventResponse(EventBase):
    id: int
    status: str
    approved_by: Optional[int] = None
    requested_by: int
    approved_user_name: Optional[str] = None
    requested_user_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True