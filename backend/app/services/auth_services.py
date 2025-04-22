# app/services/auth_services.py
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from app.models.user_model import AuthUser, UserProfile
from app.schemas.user_schema import AuthUserCreate, AuthUserResponse, AuthUserUpdate, AuthUserUpdatePwd
from app.core.auth import hash_password, refresh_access_token, verify_password, create_tokens
from app.core.config import Settings
from app.crud.crud import create_record, update_record, delete_record, get_count, get_all_records


def create_user_service(user_data: AuthUserCreate, db: Session):
    # Check if user already exists.
    existing_auth_user = db.query(AuthUser).filter(AuthUser.msu_email == user_data.msu_email).first()
    existing_profile = db.query(UserProfile).filter(UserProfile.msu_email == user_data.msu_email).first()
    if existing_auth_user or existing_profile:
        raise HTTPException(status_code=400, detail="User already exists")
    
    auth_data = {
        "msu_email": user_data.msu_email,
        "password": hash_password(user_data.password),
        "role": user_data.role or "user",
        "created_at": datetime.now(timezone.utc),
        "is_blocked": False
    }
    try:
        new_auth_user = create_record(db, AuthUser, auth_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    profile_data = {
        "user_id": new_auth_user.id,
        "msu_email": user_data.msu_email,
        "created_profile_at": datetime.now(timezone.utc)
    }
    try:
        # Note: This creates the profile record.
        create_record(db, UserProfile, profile_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"detail": "User created successfully", "status_code": "200"}

def authenticate_user_service(msu_email: str, password: str, db: Session):
    auth_user = db.query(AuthUser).filter(AuthUser.msu_email == msu_email).first()
    auth_profile = db.query(UserProfile).filter(UserProfile.msu_email == msu_email).first()
    if not auth_user or not verify_password(password, auth_user.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate both tokens
    access_token, refresh_token, refresh_expires = create_tokens(
        {"sub": auth_user.msu_email, "role": auth_user.role}
    )
    
    # Update user with refresh token and login status
    update_record(db, AuthUser, auth_user.id, {
        "refresh_token": refresh_token,
        "refresh_token_expires_at": refresh_expires,
        "last_login": datetime.now(timezone.utc),
        "is_logged_in": True
    })

    update_record(db, UserProfile, auth_profile.user_id, {
        "last_login": datetime.now(timezone.utc),
        "is_logged_in": True
    })
    
    res = AuthUserResponse(
        id=auth_user.id,
        msu_email=auth_user.msu_email,
        role=auth_user.role,
        created_at=auth_user.created_at,
        modified_at=auth_user.modified_at,
        is_logged_in = auth_user.is_logged_in,
        refresh_token_expires_at = auth_user.refresh_token_expires_at,
        last_login = auth_user.last_login,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token, 
        "token_type": "bearer",
        "user": res
    }

def delete_user_by_admin_service(user_id: int, db: Session):
    auth_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not auth_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        success = delete_record(db, AuthUser, user_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete user")
        return {"detail": "User deleted successfully", "status_code": "200"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def update_auth_user_service(user_id: int, user_data: AuthUserUpdate, db: Session):
    auth_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not auth_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {
        "msu_email": user_data.msu_email,
        "role": user_data.role,
        "modified_at": datetime.now(timezone.utc)
    }

    if user_data.password:
        update_data["password"] = hash_password(user_data.password)

    try:
        updated_user = update_record(db, AuthUser, user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found for update")
        return updated_user  # Now returning the updated user instance
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    
def update_student_password_service(user_id: int, update_data: AuthUserUpdatePwd, db: Session):
    """
    Service function for updating a student's password.
    It verifies the current password before updating to the new password.
    """
    auth_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not auth_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify the provided current password
    if not verify_password(update_data.current_password, auth_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    update_dict = {
        "password": hash_password(update_data.new_password),
        "modified_at": datetime.now(timezone.utc)
    }
    
    updated_user = update_record(db, AuthUser, user_id, update_dict)
    if not updated_user:
        raise HTTPException(status_code=400, detail="Password update failed")
    return updated_user


def get_all_auth_users_service(db: Session, skip: int = 0, limit: int = 100):
    """
    Return all auth users with pagination.
    """
    return get_all_records(db, AuthUser, skip=skip, limit=limit)

def get_total_auth_users_service(db: Session):
    """
    Return the total count of auth users.
    """
    return get_count(db, AuthUser)

def get_new_users_service(db: Session, skip: int = 0, limit: int = 10):
    try:
        new_users = (
            db.query(AuthUser)
            .order_by(AuthUser.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return new_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving new users: {e}")


def logout_user_service(user_id: int, db: Session):
    """Service to logout a user by invalidating their refresh token."""
    auth_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    auth_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if not auth_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Clear refresh token and update login status
    update_record(db, AuthUser, user_id, {
        "refresh_token": None,
        "refresh_token_expires_at": None,
        "is_logged_in": False
    })

    update_record(db, UserProfile, user_id, {
        "is_logged_in": False
    })
    return {"detail": "Successfully logged out"}

def get_auth_user_by_id_service(user_id: int, db: Session) -> AuthUserResponse:
    auth_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not auth_user:
        raise HTTPException(status_code=404, detail="User not found")
    return auth_user