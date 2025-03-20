# backend/app/main.py
from fastapi import FastAPI

from .api.routes.users import router as users_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Roommate Backend app"}

# Include the users router
app.include_router(users_router, prefix="/api")