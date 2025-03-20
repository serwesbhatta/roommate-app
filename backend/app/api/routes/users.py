# backend/app/api/routes/users.py
from fastapi import APIRouter, HTTPException

from ...schemas.user import UserCreate
from ...services.user import create_user

router = APIRouter()

@router.post("/users")
def create_user_route(user: UserCreate):
    try:
        new_user = create_user(
            first_name=user.first_name,
            last_name=user.last_name,
            msu_id=user.msu_id,
            msu_email=user.msu_email,
            password=user.password
        )
        return {"message": "User created successfully", "user": new_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))