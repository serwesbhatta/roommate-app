from typing import List, Optional, Dict
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from ..models.feedback_model import Feedback
from ..schemas.feedback_schema import FeedbackCreate, FeedbackResponse, FeedbackUpdate, FeedbackCreateRequest
from ..schemas.auth_schema import CurrentUser
from ..crud.crud import (
    create_record, 
    get_record_by_id, 
    get_all_records, 
    update_record, 
    delete_record,
    get_count
)


class FeedbackService:
    def __init__(self, db: Session, current_user: CurrentUser):
        self.db = db
        self.current_user = current_user
    
    def create_feedback(self, feedback: FeedbackCreateRequest):
        giver_user_id = self.current_user.user_id

        feedback_given = self.has_user_given_feedback(giver_user_id, feedback.receiver_user_id)

        if feedback_given:
            raise ValueError("Feedback already given to this user.")

        feedback_data = FeedbackCreate(
            giver_user_id=giver_user_id,
            **feedback.model_dump()
        )

        created_feedback = create_record(
            db=self.db,
            model=Feedback,
            data=feedback_data
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

    def delete_feedback(self, receiver_user_id: int) -> bool:
        given_feedback = self.get_current_feedback(receiver_user_id)

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

    def has_user_given_feedback(self, receiver_user_id: int) -> bool:
        giver_user_id = self.current_user.user_id
        
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
    def list_all_feedbacks(self, skip: int = 0, limit: int = 100) -> Optional[List[FeedbackResponse]]:
        if self.current_user.role == "admin":
            return get_all_records(
                db=self.db,
                model=Feedback,
                skip=skip,
                limit=limit
            )
        
        return "No access for students"
    
    # Helper function
    def get_current_feedback(self, receiver_user_id: int):
        giver_user_id = self.current_user.user_id
        
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