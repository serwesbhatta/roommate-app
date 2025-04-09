from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict

from ...schemas.feedback_schema import FeedbackResponse, FeedbackCreateRequest, FeedbackUpdate
from ...schemas.auth_schema import CurrentUser
from ...services.feedback_services import FeedbackService
from ...database import get_db
from ...core.auth import get_current_active_user

router = APIRouter()

@router.post("/feedbacks", response_model=FeedbackResponse)
def create_feedback_route(
    feedback: FeedbackCreateRequest, 
    db: Session = Depends(get_db), 
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        feedback = service.create_feedback(feedback)
        return feedback
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/feedbacks/{receiver_user_id}", response_model=FeedbackResponse)
def update_feedback_route(
    feedback: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        feedback = service.update_feedback(feedback)
        return feedback
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/feedbacks/{receiver_user_id}", response_model=bool)
def delete_feedback_route(
    receiver_user_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        return service.delete_feedback(receiver_user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/feedbacks/user_received/{receiver_id}", response_model=List[FeedbackResponse])
def list_feedback_user_received_route(
    receiver_user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        return service.list_feedback_user_received(receiver_user_id, skip, limit)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/feedbacks/user_gave/{giver_user_id}", response_model=List[FeedbackResponse])
def list_feedback_user_gave_route(
    giver_user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        return service.list_feedback_user_gave(giver_user_id, skip, limit)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/feedbacks/average_rating/{user_id}", response_model=float)
def get_averate_rating_route(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        return service.get_average_rating(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("feedbacks/already_given/{receiver_user_id}", response_model=bool)
def feedback_already_given_route(
    receiver_user_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    try:
        service = FeedbackService(db, current_user)
        return service.has_user_given_feedback(receiver_user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))