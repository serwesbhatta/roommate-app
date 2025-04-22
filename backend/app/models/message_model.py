from sqlalchemy import Column, Integer, String, Table, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

# Association table for group members
group_members = Table(
    "group_members",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("chat_groups.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.now(timezone.utc)),
    Column("is_admin", Integer, default=0)  # 0: regular member, 1: admin
)
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"))
    receiver_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    sender = relationship("UserProfile", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("UserProfile", foreign_keys=[receiver_id], back_populates="received_messages")


class ChatGroup(Base):
    __tablename__ = "chat_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    creator_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    creator = relationship("UserProfile", foreign_keys=[creator_id], back_populates="created_groups")
    members = relationship("UserProfile", secondary=group_members, back_populates="chat_groups")
    messages = relationship("GroupMessage", back_populates="group", cascade="all, delete-orphan")


class GroupMessage(Base):
    __tablename__ = "group_messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("chat_groups.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="SET NULL"), nullable=True)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # Relationships
    group = relationship("ChatGroup", back_populates="messages")
    sender = relationship("UserProfile", foreign_keys=[sender_id], back_populates="sent_group_messages")


