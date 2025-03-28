from datetime import timedelta, datetime, timezone
from typing import Optional, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .config import Settings 
from ..database import get_db
from ..models.user_model import AuthUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
) -> Dict:
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
        username: str = payload.get("sub")
        role: str = payload.get("role")
        
        if username is None:
            raise credentials_exception
        
        # Verify user exists in database
        user = get_user_by_email(db, username)
        if not user:
            raise credentials_exception
        
        return {
            "username": username, 
            "role": role,
            "user_id": user.id
        }
    except JWTError:
        raise credentials_exception

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

def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """
    Additional dependency to check if the user is active.
    Can be extended to include more checks like account status.
    """
    # You can add more checks here, like checking if the user is blocked
    return current_user