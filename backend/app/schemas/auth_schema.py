from pydantic import BaseModel

class CurrentUser(BaseModel):
    user_id: int
    role: str
    username: str