from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...schemas.user import UserCreate, UserUpdate, UserResponse
from ...services.user import UserService

router = APIRouter()

@router.post("/", response_model=UserResponse)
def create_user_route(
    user: UserCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new user
    
    :param user: User creation details
    :param db: Database session
    :return: Created user
    """
    try:
        service = UserService(db)
        return service.create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse)
def get_user_route(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific user by ID
    
    :param user_id: ID of the user
    :param db: Database session
    :return: User details
    """
    try:
        service = UserService(db)
        return service.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/", response_model=List[UserResponse])
def list_users_route(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    List users with pagination
    
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :param db: Database session
    :return: List of users
    """
    service = UserService(db)
    return service.list_users(skip=skip, limit=limit)

@router.put("/{user_id}", response_model=UserResponse)
def update_user_route(
    user_id: int, 
    user: UserUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an existing user
    
    :param user_id: ID of the user to update
    :param user: Updated user details
    :param db: Database session
    :return: Updated user
    """
    try:
        service = UserService(db)
        return service.update_user(user_id, user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{user_id}")
def delete_user_route(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a user
    
    :param user_id: ID of the user to delete
    :param db: Database session
    :return: Deletion confirmation
    """
    try:
        service = UserService(db)
        service.delete_user(user_id)
        return {"message": "User deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))