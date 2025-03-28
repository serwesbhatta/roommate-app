from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone

from ..models.user_model import AuthUser, UserProfile
from ..schemas.user_schema import AuthUserCreate, UserProfileCreate, AuthUserResponse
from ..database import SessionLocal  # Changed from session_factory
from ..core.auth import hash_password, create_access_token, verify_password
from ..core.config import Settings 

def get_db():
    """
    Dependency to get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_user(user_data: AuthUserCreate, db: Session):
    """
    Create a new user with separate auth and profile information
    """
    try:
        # Check if user already exists
        existing_auth_user = db.query(AuthUser).filter(
            AuthUser.msu_email == user_data.msu_email
        ).first()
        
        existing_profile = db.query(UserProfile).filter(
            (UserProfile.msu_email == user_data.msu_email)
        ).first()
        
        if existing_auth_user or existing_profile:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create AuthUser
        new_auth_user = AuthUser(
            msu_email=user_data.msu_email,
            password=hash_password(user_data.password),
            role=user_data.role or "user",
            created_at = datetime.now(timezone.utc),
            is_blocked = False
        )
        
        db.add(new_auth_user)
        db.flush()  # This will populate the ID for the new auth user
        
        # Create UserProfile
        new_user_profile = UserProfile(
            user_id=new_auth_user.id,
            msu_email=user_data.msu_email,
            created_profile_at = datetime.now(timezone.utc)
        )
        
        db.add(new_user_profile)
        db.commit()
        db.refresh(new_auth_user)
        db.refresh(new_user_profile)
        
        return {    
            "detail": "User created successfully",
            "status_code":"200"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def authenticate_user(msu_email: str, password: str, db: Session):
    """
    Authenticate a user and return a JWT token if credentials are valid
    """
    auth_user = db.query(AuthUser).filter(AuthUser.msu_email == msu_email).first()
    
    if not auth_user or not verify_password(password, auth_user.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=Settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": auth_user.msu_email, 
            "role": auth_user.role
        }, 
        expires_delta=access_token_expires
    )

    res = AuthUserResponse(
        id = auth_user.id,
        msu_email = auth_user.msu_email,
        role = auth_user.role,
        created_at = auth_user.created_at,
        modified_at = auth_user.modified_at
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": res
    }

def delete_user_by_admin(user_id: int, db: Session):
    """
    Delete a user by admin.
    """
    existing_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        db.delete(existing_user)
        db.commit()
        return {    
            "detail": "User deleted successfully",
            "status_code":"200"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def update_auth(user_id: int, user: AuthUserCreate, db: Session):
    """
    update a user authentication details.
    """
    existing_user = db.query(AuthUser).filter(AuthUser.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        existing_user.msu_email = user.msu_email
        existing_user.password = hash_password(user.password)
        existing_user.role = user.role
        existing_user.modified_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(existing_user)

        return {    
            "detail": "User updated successfully",
            "status_code":"200"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))