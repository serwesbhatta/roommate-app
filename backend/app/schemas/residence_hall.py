from pydantic import BaseModel
from typing import Optional

class ResidenceHallBase(BaseModel):
    name: str
    address: str
    amenities: Optional[str]

class ResidenceHallCreate(ResidenceHallBase):
    pass

class ResidenceHallUpdate(BaseModel):
    name: Optional[str]
    address: Optional[str]
    amenities: Optional[str]

class ResidenceHallResponse(ResidenceHallBase):
    id: int

    model_config = {
        "from_attributes": True
    }