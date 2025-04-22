# app/services/user_service.py
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from sqlalchemy import or_
from typing import List
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


def search_user_profiles_by_query_service(
    db: Session,
    query: str,
    skip: int = 0,
    limit: int = 100,
) -> List[UserProfile]:
    """
    Return profiles where first_name OR last_name OR msu_email
    contains the query (case-insensitive).
    """
    # build a single OR filter
    or_filter = or_(
        UserProfile.first_name.ilike(f"%{query}%"),
        UserProfile.last_name.ilike(f"%{query}%"),
        UserProfile.msu_email.ilike(f"%{query}%"),
    )

    results = (
        db
        .query(UserProfile)
        .filter(or_filter)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return results


def filter_user_profiles_by_demographics_service(
    db: Session,
    age: int = None,
    gender: str = None,
    majors: str = None,
    skip: int = 0,
    limit: int = 100,
):
    """
    Returns profiles filtered by age, gender, and/or majors.
    All supplied filters are applied with AND. At least one param required.
    """
    if age is None and gender is None and majors is None:
        raise HTTPException(
            status_code=400,
            detail="At least one of age, gender or majors must be provided",
        )

    query = db.query(UserProfile)
    if age is not None:
        query = query.filter(UserProfile.age == age)
    if gender:
        query = query.filter(UserProfile.gender == gender)
    if majors:
        query = query.filter(UserProfile.majors.ilike(f"%{majors}%"))

    return query.offset(skip).limit(limit).all()