from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Group schemas
class GroupMemberBase(BaseModel):
    user_id: int
    is_admin: bool = False

class GroupMemberCreate(GroupMemberBase):
    pass

class GroupMemberResponse(GroupMemberBase):
    group_id: int
    joined_at: datetime
    
    class Config:
        orm_mode = True

class UserBasicInfo(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image: Optional[str] = None
    msu_email: str
    is_logged_in: Optional[bool] = None
    last_login: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    creator_id: int
    member_ids: List[int]

class GroupUpdate(GroupBase):
    pass

class GroupResponse(GroupBase):
    id: int
    creator_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    members: List[UserBasicInfo] = []
    
    class Config:
        orm_mode = True

class GroupDetail(GroupResponse):
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0




class GroupMessageBase(BaseModel):
    content: str

class GroupMessageCreate(GroupMessageBase):
    group_id: int
    sender_id: int

class GroupMessageResponse(GroupMessageBase):
    id: int
    group_id: int
    sender_id: Optional[int] = None
    timestamp: datetime
    
    class Config:
        orm_mode = True

class GroupMessageWithSender(GroupMessageResponse):
    sender_name: Optional[str] = None
    sender_image: Optional[str] = None
