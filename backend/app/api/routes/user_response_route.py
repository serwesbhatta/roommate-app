from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.user_response_schema import UserResponseCreate
from ...services.user_response_service import UserResponseService
from ...database import get_db

router = APIRouter()

@router.post("/user-responses/{user_profile_id}")
def submit_responses(user_profile_id: int, responses: UserResponseCreate, db: Session = Depends(get_db)):
    try:
        service = UserResponseService(db)
        user_response = service.save_user_responses(user_profile_id, responses)
        return user_response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
