from pydantic import BaseModel
from typing import List
from .user_schema import UserProfileResponse

class CompatibilityScore(BaseModel):
    user1_id: int
    user2_id: int
    compatibility_score: float


class UserMatch(BaseModel):
    user_id: int
    compatibility_score: float
    profile: UserProfileResponse


class TopMatches(BaseModel):
    matches: List[UserMatch]