from sqlalchemy.orm import Session
from typing import List, Optional

from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from ..crud.user import (
    create_user as crud_create_user,
    get_user_by_id,
    get_user_by_email,
    get_all_users,
    update_user,
    delete_user
)
# from ..utils.password_hasher import hash_password, verify_password

class UserService:
    """
    Service layer for user-related operations.
    """
    def __init__(self, db: Session):
        """
        Initialize the service with a database session.
        
        :param db: Database session
        """
        self.db = db

    def create_user(self, user: UserCreate) -> UserResponse:
        """
        Create a new user with password hashing and validation.
        
        :param user: User creation data
        :return: Created user response
        """
        # Check if user already exists
        existing_user = get_user_by_email(self.db, user.msu_email)
        if existing_user:
            raise ValueError(f"User with email {user.msu_email} already exists")
        
        # Hash the password
        # TO-DO: hash_password
        # hashed_password = hash_password(user.password)

        # For now
        hashed_password = user.password
        
        # Prepare user data
        user_data = user.model_dump()
        user_data['password'] = hashed_password
        
        # Create user
        created_user = crud_create_user(self.db, UserCreate(**user_data))
        
        return UserResponse.model_validate(created_user)

    def authenticate_user(self, email: str, password: str) -> Optional[UserResponse]:
        """
        Authenticate a user by email and password.
        
        :param email: User's email
        :param password: User's password
        :return: Authenticated user or None
        """
        user = get_user_by_email(self.db, email)
        
        if not user:
            return None
        
        # TO-DO: verify the password
        # if not verify_password(password, user.password):
        #     return None
        
        return UserResponse.model_validate(user)

    def get_user(self, user_id: int) -> UserResponse:
        """
        Retrieve a user by their ID.
        
        :param user_id: ID of the user
        :return: User response
        """
        user = get_user_by_id(self.db, user_id)
        
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        
        return UserResponse.model_validate(user)

    def list_users(self, skip: int = 0, limit: int = 100) -> List[UserResponse]:
        """
        List users with pagination.
        
        :param skip: Number of records to skip
        :param limit: Maximum number of records to return
        :return: List of user responses
        """
        users = get_all_users(self.db, skip, limit)
        return [UserResponse.model_validate(user) for user in users]

    def update_user(self, user_id: int, user_update: UserUpdate) -> UserResponse:
        """
        Update an existing user's information.
        
        :param user_id: ID of the user to update
        :param user_update: User update data
        :return: Updated user response
        """
        updated_user = update_user(self.db, user_id, user_update)
        
        if not updated_user:
            raise ValueError(f"User with ID {user_id} not found")
        
        return UserResponse.model_validate(updated_user)

    def delete_user(self, user_id: int) -> bool:
        """
        Delete a user.
        
        :param user_id: ID of the user to delete
        :return: True if deletion was successful
        """
        deletion_result = delete_user(self.db, user_id)
        
        if not deletion_result:
            raise ValueError(f"User with ID {user_id} not found")
        
        return True