from datetime import timedelta, datetime, timezone
from typing import Optional, Dict, Tuple

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .config import Settings 
from ..database import get_db
from ..models.user_model import AuthUser
from ..schemas.user_schema import CurrentUser


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def hash_password(password: str) -> str:
    """Hash the password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, Settings.SECRET_KEY, algorithm=Settings.ALGORITHM)
    return encoded_jwt

def get_user_by_email(db: Session, email: str):
    """
    Retrieve a user by email from the database.
    """
    return db.query(AuthUser).filter(AuthUser.msu_email == email).first()

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Optional[CurrentUser]:
    """
    Decode the JWT and return the current user's information.
    Raises an HTTPException if the token is invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, Settings.SECRET_KEY, algorithms=[Settings.ALGORITHM])
        msu_email: str = payload.get("sub")
        role: str = payload.get("role")
        
        if msu_email is None:
            raise credentials_exception
        
        # Verify user exists in database
        user = get_user_by_email(db, msu_email)
        if not user:
            raise credentials_exception
        
        return {
            "msu_email": msu_email, 
            "role": role,
            "user_id": user.id
        }
    except JWTError:
        raise credentials_exception
    
def get_current_active_user(current_user: dict = Depends(get_current_user)) -> Optional[CurrentUser]:
    """
    Verifies the user account is active and not blocked.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User authentication failed",
        )
    
    # Added check to verify user isn't blocked
    db = next(get_db())
    user = get_user_by_email(db, current_user["msu_email"])
    
    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is blocked",
        )
    
    return current_user


def require_role(required_role: str):
    """
    Dependency to check if the current user has the required role.
    """
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user['role'] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker


def create_tokens(data: dict) -> Tuple[str, str, datetime]:
    """Create both access and refresh tokens."""
    # Access token - short lived (e.g., 30 minutes)
    access_token_expires = timedelta(minutes=Settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data, access_token_expires)
    
    # Refresh token - longer lived (e.g., 7 days)
    refresh_token_expires_delta = timedelta(days=Settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token_expires = datetime.now(timezone.utc) + refresh_token_expires_delta
    
    refresh_data = data.copy()
    refresh_data.update({"token_type": "refresh"})
    refresh_token = jwt.encode(
        {**refresh_data, "exp": refresh_token_expires}, 
        Settings.SECRET_KEY, 
        algorithm=Settings.ALGORITHM
    )
    
    return access_token, refresh_token, refresh_token_expires

def refresh_access_token(refresh_token: str, db: Session) -> str:
    """Create a new access token using the refresh token."""
    try:
        # Decode refresh token
        payload = jwt.decode(
            refresh_token, 
            Settings.SECRET_KEY, 
            algorithms=[Settings.ALGORITHM]
        )
        
        if payload.get("token_type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        # Extract user info
        msu_email = payload.get("sub")
        if not msu_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        
        # Get user from database
        user = get_user_by_email(db, msu_email)
        if not user or user.refresh_token != refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        # Check if refresh token is expired in database
        # if user.refresh_token_expires_at < datetime.now(timezone.utc):
        #     raise HTTPException(
        #         status_code=status.HTTP_401_UNAUTHORIZED,
        #         detail="Refresh token expired",
        #     )

        expires_at = user.refresh_token_expires_at
        if not expires_at:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired",
            )
        # SQLite often returns a naïve datetime; normalise it
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired",
            )
        
        # Create new access token
        new_access_token = create_access_token(
            {"sub": user.msu_email, "role": user.role}
        )
        
        return new_access_token
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )