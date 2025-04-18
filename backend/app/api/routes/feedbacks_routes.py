from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.feedback_schema import FeedbackResponse, FeedbackCreate, FeedbackUpdate
from ...services.feedback_services import FeedbackService
from ...database import get_db

router = APIRouter()

@router.post("/feedbacks", response_model=FeedbackResponse)
def create_feedback_route(
    feedback: FeedbackCreate, 
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        feedback = service.create_feedback(feedback)
        return feedback
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/feedbacks/{receiver_user_id}", response_model=FeedbackResponse)
def update_feedback_route(
    feedback: FeedbackUpdate,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        feedback = service.update_feedback(feedback)
        return feedback
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/feedbacks/{receiver_user_id}", response_model=bool)
def delete_feedback_route(
    giver_user_id: int,
    receiver_user_id: int,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        return service.delete_feedback(giver_user_id, receiver_user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/feedbacks/user_received/{receiver_user_id}", response_model=List[FeedbackResponse])
def list_feedback_user_received_route(
    receiver_user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        return service.list_feedback_user_received(receiver_user_id, skip, limit)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/feedbacks/user_gave/{giver_user_id}", response_model=List[FeedbackResponse])
def list_feedback_user_gave_route(
    giver_user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        return service.list_feedback_user_gave(giver_user_id, skip, limit)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/feedbacks/average_rating/{user_id}", response_model=float)
def get_averate_rating_route(
    user_id: int,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        return service.get_average_rating(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("feedbacks/already_given/{receiver_user_id}", response_model=bool)
def feedback_already_given_route(
    giver_user_id: int,
    receiver_user_id: int,
    db: Session = Depends(get_db)
):
    try:
        service = FeedbackService(db)
        return service.has_user_given_feedback(giver_user_id, receiver_user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))