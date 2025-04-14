from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import validator

class EventBase(BaseModel):
    title: str
    description: str
    event_start: datetime
    event_end: datetime
    location: str

class EventCreate(EventBase):
    requested_by: int

class EventUpdate(EventBase):
    # title: Optional[str] = None
    # description: Optional[str] = None
    # event_start: Optional[datetime] = None
    # event_end: Optional[datetime] = None
    # location: Optional[str] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None
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

    @validator("status", pre=True, always=True)
    def set_default_status(cls, value):
        return value or "pending"
    
    class Config:
        orm_mode = True