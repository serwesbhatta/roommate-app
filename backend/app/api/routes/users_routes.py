from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, Body, BackgroundTasks
from typing import List
from sqlalchemy import or_
from sqlalchemy.orm import Session
from datetime import datetime
from ...core.auth import get_current_active_user, refresh_access_token
from fastapi.security import OAuth2PasswordRequestForm


from ...schemas.user_schema import (
    UserProfileCreate, 
    UserProfileResponse,  
    UserProfileUpdate,
    AuthUserCreate, 
    AuthUserResponse, 
    LoginUser,
    AuthUserUpdatePwd,  # schema for student password update
    AuthUserUpdate,
    RefreshTokenRequest,
    TokenResponse,
    TokenPair,
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
    get_new_users_service,
    search_user_profiles_by_query_service,
    filter_user_profiles_by_demographics_service,
    logout_user_service,
    get_auth_user_by_id_service
)
from ...core.auth import (
    get_current_active_user,
    require_role,
    hash_password,
    verify_password,
    create_tokens,
    oauth2_scheme,
)
from ...database import get_db
from app.websockets.chat_ws import manager

router = APIRouter(
)

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


@router.post("/login",  tags=["Auth"])
def login_for_access_token(
    background_tasks: BackgroundTasks,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    result = authenticate_user_service(form_data.username, form_data.password, db)
    background_tasks.add_task(manager.broadcast_presence, result["user"].id, True)
    return result

@router.post(
    "/token/refresh",
    response_model=TokenResponse,
    summary="Refresh an expired access token",
    status_code=200,
)
def refresh_token(
    body: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    try:
        print("refresh token request",body.refresh_token)
        new_access = refresh_access_token(body.refresh_token, db)
        return TokenResponse(access_token=new_access)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error refreshing token: {e}"
        )
    

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


@router.post("/logout")
async def logout(
    background_tasks: BackgroundTasks, 
    db: Session=Depends(get_db),
    current_user=Depends(get_current_active_user)
   
):
    user_id = current_user.get("user_id") 
    if user_id is None:
        raise HTTPException(status_code=400, detail="Invalid user")
    background_tasks.add_task(manager.broadcast_presence, user_id, False)
    return logout_user_service(user_id, db)

@router.get("/admin_users/{user_id}", response_model=AuthUserResponse)
def get_auth_user_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to retrieve a single auth user by user ID.
    """
    try:
        return get_auth_user_by_id_service(user_id, db)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {e}")




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

# ---------------------------
# Search by name or email
# ---------------------------
@router.get(
    "/profiles/search",
    response_model=List[UserProfileResponse],
    summary="Search user profiles by query string",
)
def search_user_profiles(
    query: str = Query(..., min_length=1, description="Search text for first or last name"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    Search across first_name and last_name (and optionally email)
    for any partial, case‐insensitive match.
    """
    try:
        return search_user_profiles_by_query_service(db, query, skip, limit)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in search_user_profiles: {e}")


# ---------------------------
# Filter by age, gender, majors
# ---------------------------
@router.get(
    "/profiles/filter",
    response_model=List[UserProfileResponse],
    summary="Filter user profiles by age, gender, and/or majors",
)
def filter_user_profiles(
    age: int = None,
    gender: str = None,
    majors: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    try:
        return filter_user_profiles_by_demographics_service(
            db, age, gender, majors, skip, limit
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in filter_user_profiles: {e}")