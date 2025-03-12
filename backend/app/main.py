from fastapi import FastAPI, HTTPException

from .services import create_user
from .pydanticModels import UserCreate


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Roommate Backend app"}

@app.post("/create-user")
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