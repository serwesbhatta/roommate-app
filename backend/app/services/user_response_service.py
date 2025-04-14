from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.user_response_model import UserResponse
from ..schemas.user_response_schema import UserResponseCreate, SingleUserResponse
from ..crud.crud import (
    create_record
)
class UserResponseService:
    def __init__(self, db: Session):
        self.db = db

    def save_user_responses(self, user_profile_id: int, response_data: UserResponseCreate):
        user_responses = []

        for response in response_data.responses:
            # Check for existing record
            existing = (
                self.db.query(UserResponse)
                .filter(
                    UserResponse.user_profile_id == user_profile_id,
                    UserResponse.question_id == response.question_id
                )
                .first()
            )
            if existing:
                raise ValueError(f"Response already exists for question_id={response.question_id}")

            # Save new response
            response_dict = response.model_dump()
            response_dict["user_profile_id"] = user_profile_id
            user_response = create_record(
                db=self.db,
                model=UserResponse,
                data=response_dict
            )
            user_responses.append(user_response)

        return user_responses

    def get_user_responses(self, user_profile_id: int):
        return (
            self.db.query(UserResponse)
            .filter(UserResponse.user_profile_id == user_profile_id)
            .all()
        )

    def update_user_responses(self, user_profile_id: int, response_data: UserResponseCreate):
        updated_responses = []

        for response in response_data.responses:
            existing_response = (
                self.db.query(UserResponse)
                .filter(
                    UserResponse.user_profile_id == user_profile_id,
                    UserResponse.question_id == response.question_id,
                )
                .first()
            )

            if not existing_response:
                raise ValueError(f"No existing response found for question_id={response.question_id}")

            # Update the existing response
            existing_response.selected_option = response.selected_option
            self.db.add(existing_response)
            updated_responses.append(existing_response)

        self.db.commit()
        return updated_responses
    
    def delete_user_response(self, user_profile_id: int, question_id: int) -> bool:
        response = (
            self.db.query(UserResponse)
            .filter(
                UserResponse.user_profile_id == user_profile_id,
                UserResponse.question_id == question_id
            )
            .first()
        )

        if not response:
            return False

        self.db.delete(response)
        self.db.commit()
        return True

