from pydantic import BaseModel


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    msu_id: int
    msu_email: str
    password: str