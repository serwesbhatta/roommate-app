from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from ...schemas.user_schema import (
    UserProfileCreate, 
    UserProfileResponse,  
    AuthUserCreate, 
    AuthUserResponse, 
    LoginUser
)
from ...services.user_services import (
    create_user_service,
    authenticate_user_service, 
    delete_user_service, 
    update_auth_user_service
)
from ...core.auth import get_current_user, require_role
from ...database import get_db

router = APIRouter()

@router.post("/admin_users")
def register_user(
    user: AuthUserCreate, 
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    Only accessible to admins or during open registration.
    """
    return create_user_service(user, db)

@router.post("/login")
def login_for_access_token(
    form_data: LoginUser, 
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login endpoint.
    """
    return authenticate_user_service(form_data.msu_email, form_data.password, db)

@router.delete("/admin_users/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a user.
    Only accessible to admins.
    """
    return delete_user_service(user_id, db)

@router.put("/admin_users/{user_id}", response_model=AuthUserResponse)
def update_auth_user(
    user_id: int,
    user: AuthUserCreate,
    db: Session = Depends(get_db)
):
    """
    Update a user authentication details.
    """
    return update_auth_user_service(user_id, user, db)