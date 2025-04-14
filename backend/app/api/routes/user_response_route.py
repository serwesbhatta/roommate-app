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

@router.get("/user-responses/{user_profile_id}")
def get_user_responses(user_profile_id: int, db: Session = Depends(get_db)):
    try:
        service = UserResponseService(db)
        user_responses = service.get_user_responses(user_profile_id)
        return user_responses
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/user-responses/{user_profile_id}")
def update_user_responses(user_profile_id: int, responses: UserResponseCreate, db: Session = Depends(get_db)):
    try:
        service = UserResponseService(db)
        updated_responses = service.update_user_responses(user_profile_id, responses)
        return updated_responses
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/user-responses/{user_profile_id}/{question_id}")
def delete_user_response(user_profile_id: int, question_id: int, db: Session = Depends(get_db)):
    try:
        service = UserResponseService(db)
        deleted = service.delete_user_response(user_profile_id, question_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Response not found.")
        return {"message": "Response deleted successfully."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

