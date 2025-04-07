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
            response_dict = response.model_dump()
            response_dict["user_profile_id"] = user_profile_id  # Inject user_profile_id dynamically

            user_response = create_record(
                db=self.db,
                model=UserResponse,
                data=response_dict
            )

            user_responses.append(user_response)

        return user_responses
