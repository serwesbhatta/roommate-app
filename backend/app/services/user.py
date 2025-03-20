# backend/app/services/user.py
from ..crud.user import create_user as crud_create_user

def create_user(first_name: str, last_name: str, msu_id: int, msu_email: str, password: str):
    # Add any business logic here, like password hashing
    # password = hash_password(password)
    
    return crud_create_user(
        first_name=first_name,
        last_name=last_name,
        msu_id=msu_id,
        msu_email=msu_email,
        password=password
    )
