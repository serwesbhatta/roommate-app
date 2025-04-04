from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func, Boolean, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class AuthUser(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    msu_email = Column(String(100), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    role = Column(String(50), nullable=False, default="user")

    is_blocked = Column(Boolean, default=False, nullable=False) 

    created_at = Column(DateTime(timezone=True),default=None, nullable=True)
    modified_at = Column(DateTime(timezone=True),default=None, nullable=True)

    # One-to-One Relationship with UserProfile
    profile = relationship("UserProfile", back_populates="auth_user", uselist=False, cascade="all, delete")

    # Composite Foreign Key to Room
    room_number = Column(Integer, nullable=True)
    residence_hall_id = Column(Integer, nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(
            ["room_number", "residence_hall_id"],
            ["rooms.room_number", "rooms.residence_hall_id"],
            ondelete="SET NULL"
        ),
    )

    requested_events = relationship("Event", back_populates="requested_user", foreign_keys="[Event.requested_by]")
    approved_events = relationship("Event", back_populates="approved_user", foreign_keys="[Event.approved_by]")

    # Room Model
    room = relationship("Room", back_populates="auth_users")

    # User responses to questionnaire
    responses = relationship("UserResponse", back_populates="user") 

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id", ondelete="CASCADE"), unique=True, nullable=False)
    msu_email = Column(String(100), unique=True, nullable=False)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    msu_id = Column(String(50), unique=True, nullable=True)
    profile_image = Column(String(255),nullable=True)  # Image path
    modified_profile_at = Column(DateTime(timezone=True),default=None, nullable=True)
    created_profile_at = Column(DateTime(timezone=True),default=None, nullable=True)

    # Relationship with AuthUser
    auth_user = relationship("AuthUser", back_populates="profile")