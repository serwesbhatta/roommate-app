from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from sqlalchemy.orm import Session
from datetime import datetime

from ...schemas.user_schema import (
    UserProfileCreate, 
    UserProfileResponse,  
    UserProfileUpdate,
    AuthUserCreate, 
    AuthUserResponse, 
    LoginUser,
    AuthUserUpdatePwd,  # schema for student password update
    AuthUserUpdate
)
from ...services import (
    create_user_service,
    authenticate_user_service,
    delete_user_by_admin_service,
    update_auth_user_service,
    update_student_password_service,
    get_user_profile_service,
    update_user_profile_service,
    get_all_auth_users_service,
    get_total_auth_users_service,
    get_all_user_profiles_service,
    get_total_user_profiles_service,
    get_new_users_service
)
from ...core.auth import require_role
from ...database import get_db

router = APIRouter()

# ---------------------------
# Admin Endpoints for AuthUser CRUD
# ---------------------------

@router.post("/admin_users")
def register_user(
    user: AuthUserCreate, 
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to register a new user.
    """
    try:
        return create_user_service(user, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in register_user: {e}")


@router.post("/login")
def login_for_access_token(
    form_data: LoginUser, 
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login endpoint.
    """
    try:
        return authenticate_user_service(form_data.msu_email, form_data.password, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in login: {e}")


@router.delete("/admin_users/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to delete a user.
    """
    try:
        return delete_user_by_admin_service(user_id, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in delete_user: {e}")


@router.put("/admin_users/{user_id}", response_model=AuthUserResponse)
def update_auth_user(
    user_id: int,
    user: AuthUserUpdate,
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to update a user's authentication details.
    (Admin can update all fields.)
    """
    try:
        return update_auth_user_service(user_id, user, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in update_auth_user: {e}")


@router.get("/admin_users/all", response_model=List[AuthUserResponse])
def get_all_auth_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to retrieve all auth users (with pagination).
    """
    try:
        return get_all_auth_users_service(db, skip=skip, limit=limit)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in get_all_auth_users: {e}")


@router.get("/admin_users/total")
def get_total_auth_users(
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to get the total number of auth users.
    """
    try:
        total = get_total_auth_users_service(db)
        return total
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in get_total_auth_users: {e}")
    

@router.get("/admin_users/new", response_model=List[AuthUserResponse])
def get_new_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_new_users_service(db, skip=skip, limit=limit)


# ---------------------------
# Endpoints for Students (Users)
# ---------------------------

@router.put("/users/update_password/{user_id}", response_model=AuthUserResponse)
def update_student_password(
    update_data: AuthUserUpdatePwd,
    user_id: int,  
    db: Session = Depends(get_db)
):
    """
    Endpoint for a student to update their password.
    In development mode, the current user's id is passed from the frontend.
    """
    try:
        return update_student_password_service(user_id, update_data, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in update_student_password: {e}")


# ---------------------------
# Endpoints for User Profile Operations
# ---------------------------

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    user_id: int,  # DEVELOPMENT ONLY: user_id passed directly from the frontend
    db: Session = Depends(get_db)
):
    """
    Retrieve the current user's profile.
    (Development mode: user_id is provided by the frontend.)
    """
    try:
        return get_user_profile_service(user_id, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in get_profile: {e}")


@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    user_id: int, 
    first_name: str = Form(None),
    last_name: str = Form(None),
    msu_id: str = Form(None),
    profile_image: UploadFile = File(None),
    age: int = Form(None),
    gender: str = Form(None),
    move_in_date: str = Form(None),  
    bio: str = Form(None),
    majors: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        update_data = {}
        if first_name is not None:
            update_data["first_name"] = first_name
        if last_name is not None:
            update_data["last_name"] = last_name
        if msu_id is not None:
            update_data["msu_id"] = msu_id

        if age is not None:
            update_data["age"] = age
        if gender is not None:
            update_data["gender"] = gender
        if move_in_date is not None:
            update_data["move_in_date"] = datetime.fromisoformat(move_in_date)
        if bio is not None:
            update_data["bio"] = bio
        if majors is not None:
            update_data["majors"] = majors

        # Process file upload if provided.
        if profile_image is not None:
            import os, uuid, shutil
            UPLOAD_DIRECTORY = "static/profile_images"
            os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
            file_extension = os.path.splitext(profile_image.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{file_extension}"
            file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_image.file, buffer)
            update_data["profile_image"] = file_path

        return update_user_profile_service(user_id, update_data, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in update_profile: {e}")



@router.get("/profiles/all", response_model=List[UserProfileResponse])
def get_all_user_profiles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to retrieve all user profiles (with pagination).
    """
    try:
        return get_all_user_profiles_service(db, skip=skip, limit=limit)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in get_all_user_profiles: {e}")


@router.get("/profiles/total")
def get_total_user_profiles(
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to get the total number of user profiles.
    """
    try:
        total = get_total_user_profiles_service(db)
        return total
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in get_total_user_profiles: {e}")
