from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from typing import List, Optional
from datetime import datetime

from ..models.message_model import ChatGroup, group_members, GroupMessage
from ..models.user_model import UserProfile
from ..schemas.group_schema import GroupCreate, GroupUpdate
from ..schemas.group_schema import GroupMessageCreate

class GroupService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_group(self, group_data: GroupCreate) -> ChatGroup:
        # Create group
        new_group = ChatGroup(
            name=group_data.name,
            creator_id=group_data.creator_id
        )
        self.db.add(new_group)
        self.db.flush()  # Flush to get the group ID
        
        # Add members
        for user_id in group_data.member_ids:
            is_admin = user_id == group_data.creator_id
            self.db.execute(
                group_members.insert().values(
                    group_id=new_group.id,
                    user_id=user_id,
                    joined_at=datetime.now(),
                    is_admin=1 if is_admin else 0
                )
            )
        
        # Also add the creator as a member if not in the list
        if group_data.creator_id not in group_data.member_ids:
            self.db.execute(
                group_members.insert().values(
                    group_id=new_group.id,
                    user_id=group_data.creator_id,
                    joined_at=datetime.now(),
                    is_admin=1
                )
            )
            
        self.db.commit()
        self.db.refresh(new_group)
        return new_group
    
    def get_group(self, group_id: int) -> Optional[ChatGroup]:
        return self.db.query(ChatGroup).filter(ChatGroup.id == group_id).first()
    
    def get_user_groups(self, user_id: int) -> List[ChatGroup]:
        return (
            self.db.query(ChatGroup)
            .join(group_members, ChatGroup.id == group_members.c.group_id)
            .filter(group_members.c.user_id == user_id)
            .all()
        )
    
    def get_group_with_last_message(self, user_id: int) -> List[dict]:
        # This query gets all groups with their last message info
        groups = (
            self.db.query(
                ChatGroup,
                func.max(GroupMessage.timestamp).label("last_message_time"),
                func.count(GroupMessage.id).filter(
                    and_(
                        GroupMessage.timestamp > group_members.c.joined_at,
                        GroupMessage.sender_id != user_id
                    )
                ).label("unread_count")
            )
            .join(group_members, ChatGroup.id == group_members.c.group_id)
            .outerjoin(GroupMessage, ChatGroup.id == GroupMessage.group_id)
            .filter(group_members.c.user_id == user_id)
            .group_by(ChatGroup.id)
            .order_by(desc("last_message_time"))
            .all()
        )
        
        result = []
        for group, last_message_time, unread_count in groups:
            # Get the last message content if there is one
            last_message = None
            if last_message_time:
                last_message = (
                    self.db.query(GroupMessage)
                    .filter(
                        GroupMessage.group_id == group.id,
                        GroupMessage.timestamp == last_message_time
                    )
                    .first()
                )
            
            # Get all members
            members = (
                self.db.query(UserProfile)
                .join(group_members, UserProfile.id == group_members.c.user_id)
                .filter(group_members.c.group_id == group.id)
                .all()
            )
            
            group_data = {
                "id": group.id,
                "name": group.name,
                "creator_id": group.creator_id,
                "created_at": group.created_at,
                "updated_at": group.updated_at,
                "members": members,
                "last_message": last_message.content if last_message else None,
                "last_message_time": last_message_time,
                "unread_count": unread_count,
                
            }
            result.append(group_data)
        
        return result
    
    def add_member(self, group_id: int, user_id: int, is_admin: bool = False) -> bool:
        # Check if user is already a member
        existing = (
            self.db.query(group_members)
            .filter(
                group_members.c.group_id == group_id,
                group_members.c.user_id == user_id
            )
            .first()
        )
        
        if existing:
            return False
        
        # Add user to group
        self.db.execute(
            group_members.insert().values(
                group_id=group_id,
                user_id=user_id,
                joined_at=datetime.now(),
                is_admin=1 if is_admin else 0
            )
        )
        self.db.commit()
        return True
    
    def remove_member(self, group_id: int, user_id: int) -> bool:
        result = (
            self.db.execute(
                group_members.delete().where(
                    group_members.c.group_id == group_id,
                    group_members.c.user_id == user_id
                )
            )
        )
        self.db.commit()
        return result.rowcount > 0
    
    def is_user_in_group(self, group_id: int, user_id: int) -> bool:
        return (
            self.db.query(group_members)
            .filter(
                group_members.c.group_id == group_id,
                group_members.c.user_id == user_id
            )
            .first()
        ) is not None
    
    def update_group_name(self, group_id: int, name: str) -> bool:
        group = self.get_group(group_id)
        if not group:
            return False
            
        group.name = name
        group.updated_at = datetime.now()
        self.db.commit()
        return True


class GroupMessageService:
    def __init__(self, db: Session):
        self.db = db
    
    def send_message(self, message: GroupMessageCreate) -> GroupMessage:
        new_message = GroupMessage(
            group_id=message.group_id,
            sender_id=message.sender_id,
            content=message.content
        )
        self.db.add(new_message)
        self.db.commit()
        self.db.refresh(new_message)
        return new_message
    
    def get_group_messages(self, group_id: int, skip: int = 0, limit: int = 50) -> List[GroupMessage]:
        return (
            self.db.query(GroupMessage)
            .filter(GroupMessage.group_id == group_id)
            .order_by(desc(GroupMessage.timestamp))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_message_with_sender_info(self, message_id: int):
        message = (
            self.db.query(
                GroupMessage,
                func.concat(UserProfile.first_name, ' ', UserProfile.last_name).label("sender_name"),
                UserProfile.profile_image
            )
            .join(UserProfile, GroupMessage.sender_id == UserProfile.id)
            .filter(GroupMessage.id == message_id)
            .first()
        )
        
        if not message:
            return None
        
        msg, sender_name, sender_image = message
        return {
            "id": msg.id,
            "group_id": msg.group_id,
            "sender_id": msg.sender_id,
            "content": msg.content,
            "timestamp": msg.timestamp,
            "sender_name": sender_name,
            "sender_image": sender_image
        }
