from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ...schemas.compatibility_schema import CompatibilityScore, TopMatches
from ...database import get_db

from app.services.compatibility_services import MatchingService


router = APIRouter()


@router.get("/compatibility-score/{user1_id}/{user2_id}", response_model=CompatibilityScore)
async def get_compatibility_score(
    user1_id: int,
    user2_id: int,
    db: Session = Depends(get_db)
):
    """
    Get compatibility score between two users
    """
    service = MatchingService(db)
    score = service.get_compatibility_between_users(user1_id, user2_id)
    
    return {
        "user1_id": user1_id,
        "user2_id": user2_id,
        "compatibility_score": round(score, 2)
    }


@router.get("/top-matches/{user_id}", response_model=TopMatches)
async def get_top_matches_for_user(
    user_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get top compatible users for a given user
    """
    service = MatchingService(db)
    matches = service.get_top_compatible_users(user_id, limit)
    
    return {"matches": matches}