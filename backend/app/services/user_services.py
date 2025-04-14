# app/services/user_service.py
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException
import os
from app.models.user_model import UserProfile
from app.schemas.user_schema import UserProfileUpdate
from ..crud.crud import (
    get_record_by_id, 
    get_all_records, 
    update_record, 
    get_count
)

def get_user_profile_service(user_id: int, db: Session):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

def update_user_profile_service(user_id: int, profile_update: dict, db: Session):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile_update.copy()
    
    if "profile_image" in update_data and update_data["profile_image"]:
        new_image = update_data["profile_image"]
        if profile.profile_image and profile.profile_image != new_image:
            if os.path.exists(profile.profile_image):
                try:
                    os.remove(profile.profile_image)
                except Exception as e:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Error deleting old image: {e}"
                    )
                
    update_data["modified_profile_at"] = datetime.now(timezone.utc)
    
    try:
        updated_profile = update_record(db, UserProfile, profile.id, update_data)
        if not updated_profile:
            raise HTTPException(status_code=404, detail="Profile not updated")
        return updated_profile
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



def get_all_user_profiles_service(db: Session, skip: int = 0, limit: int = 100):
    """
    Return all user profiles with pagination.
    """
    return get_all_records(db, UserProfile, skip=skip, limit=limit)

def get_total_user_profiles_service(db: Session):
    """
    Return the total count of user profiles.
    """
    return get_count(db, UserProfile)