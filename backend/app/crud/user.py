from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

def create_user(
    db: Session, 
    user: UserCreate
) -> User:
    """
    Create a new user in the database.
    
    :param db: Database session
    :param user: User creation data
    :return: Created User model instance
    """
    try:
        db_user = User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error creating user: {str(e)}")

def get_user_by_id(
    db: Session, 
    user_id: int
) -> Optional[User]:
    """
    Retrieve a user by their ID.
    
    :param db: Database session
    :param user_id: ID of the user
    :return: User instance or None
    """
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(
    db: Session, 
    email: str
) -> Optional[User]:
    """
    Retrieve a user by their email.
    
    :param db: Database session
    :param email: Email of the user
    :return: User instance or None
    """
    return db.query(User).filter(User.msu_email == email).first()

def get_all_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
) -> List[User]:
    """
    Retrieve multiple users with optional pagination.
    
    :param db: Database session
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :return: List of User instances
    """
    return db.query(User).offset(skip).limit(limit).all()

def update_user(
    db: Session, 
    user_id: int, 
    user_update: UserUpdate
) -> Optional[User]:
    """
    Update an existing user.
    
    :param db: Database session
    :param user_id: ID of the user to update
    :param user_update: User update data
    :return: Updated User instance or None
    """
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error updating user: {str(e)}")

def delete_user(
    db: Session, 
    user_id: int
) -> bool:
    """
    Delete a user by their ID.
    
    :param db: Database session
    :param user_id: ID of the user to delete
    :return: True if deletion was successful, False otherwise
    """
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error deleting user: {str(e)}")