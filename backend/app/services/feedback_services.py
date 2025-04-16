from typing import List, Optional, Dict
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from ..models.feedback_model import Feedback
from ..schemas.feedback_schema import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from ..services.user_services import get_user_profile_service
from ..crud.crud import (
    create_record, 
    get_all_records, 
    update_record, 
    delete_record
)


class FeedbackService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_feedback(self, feedback: FeedbackCreate):
        feedback_given = self.has_user_given_feedback(feedback.giver_user_id, feedback.receiver_user_id)

        if feedback_given:
            raise ValueError("Feedback already given to this user.")

        created_feedback = create_record(
            db=self.db,
            model=Feedback,
            data=feedback
        )

        return created_feedback


    def update_feedback(self, feedback: FeedbackUpdate):
        given_feedback = self.get_current_feedback(feedback.receiver_user_id)
        
        feedback_data = feedback.model_dump()

        updated_feedback = update_record(
            db=self.db,
            model=Feedback,
            record_id=given_feedback.id,
            update_data=feedback_data
        )

        return updated_feedback

    def delete_feedback(self, giver_user_id: int, receiver_user_id: int) -> bool:
        given_feedback = self.get_current_feedback(giver_user_id=giver_user_id, receiver_user_id=receiver_user_id)

        deleted_feedback = delete_record(
            db=self.db,
            model=Feedback,
            record_id=given_feedback.id
        )

        if not deleted_feedback:
            raise ValueError(f"Feedback for user with {receiver_user_id} not found.")
        
        return True
    
    # Returns all the feedback that the user received
    def list_feedback_user_received(self, user_id: int, skip: int = 0, limit: int = 100) -> List[FeedbackResponse]:
        filter_condition = Feedback.receiver_user_id == user_id

        feedbacks = get_all_records(
            db= self.db,
            model=Feedback,
            skip=skip,
            limit=limit,
            filter_condition=filter_condition
        )

        return feedbacks

    # Return all the feedback that the user gave
    def list_feedback_user_gave(self, user_id: int, skip: int = 0, limit: int = 100) -> List[FeedbackResponse]:
        filter_condition = Feedback.giver_user_id == user_id

        feedbacks = get_all_records(
            db=self.db,
            model=Feedback,
            skip=skip,
            limit=limit,
            filter_condition=filter_condition
        )

        return feedbacks

    def get_average_rating(self, user_id: int) -> float:
        feedbacks = self.list_feedback_user_received(user_id)

        total_rating = sum(feedback.rating for feedback in feedbacks)
        number_of_feedbacks = len(feedbacks)

        if number_of_feedbacks == 0:
            return 0.0  # Avoid division by zero

        average = total_rating / number_of_feedbacks
        return round(average, 1)

    def has_user_given_feedback(self, giver_user_id: int, receiver_user_id: int) -> bool:
        filter_condition = and_(
            Feedback.giver_user_id == giver_user_id, 
            Feedback.receiver_user_id == receiver_user_id
        )

        feedback = get_all_records(
            db=self.db,
            model=Feedback,
            skip=0,
            limit=10,
            filter_condition=filter_condition
        )

        if len(feedback) > 0:
            return True
        
        return False
    
    # Admin only
    def list_all_feedbacks(self, user_id: int, skip: int = 0, limit: int = 100) -> List[FeedbackResponse]:
        user = get_user_profile_service(user_id=user_id, db=self.db)

        if not user or not user.auth_user:
            raise ValueError("User not found")

        if user.auth_user.role != "admin":
            raise ValueError("Access denied: Only admins can view feedbacks")

        return get_all_records(
            db=self.db,
            model=Feedback,
            skip=skip,
            limit=limit
        )
    
    # Helper function
    def get_current_feedback(self, giver_user_id: int, receiver_user_id: int):
        filter_condition = and_(
            Feedback.giver_user_id == giver_user_id, 
            Feedback.receiver_user_id == receiver_user_id
        )

        feedback_list = get_all_records(
            db=self.db,
            model=Feedback,
            skip=0,
            limit=10,
            filter_condition=filter_condition
        )

        if not feedback_list:
            raise ValueError("User hasn't provided feedback yet.")


        if len(feedback_list) == 0:
            raise ValueError("User didn't even give the feedback yet!")
        
        given_feedback = feedback_list[0]

        return given_feedback

    # Admin only: Extra: Implement after other features are implemented
    def search_feedback():
        pass

    # Extra feature
    def report_feedback():
        pass