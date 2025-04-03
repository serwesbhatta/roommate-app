from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.option_schema import OptionCreate, OptionResponse, OptionUpdate
from ...services.option_services import OptionService
from ...database import get_db

router = APIRouter()

@router.post("/options", response_model=OptionResponse)
def create_option_route(option: OptionCreate, db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        new_option = service.create_option(option)
        return new_option
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/options/{option_id}", response_model=OptionResponse)
def get_option(option_id: int, db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        option = service.get_option(option_id)
        return option
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/options", response_model=List[OptionResponse])
def list_options_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        options = service.list_option(skip, limit)
        return options
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/options/{option_id}", response_model=OptionResponse)
def update_option_route(option_id: int, option: OptionUpdate, db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        updated_option = service.update_option(option_id, option)
        return updated_option
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/options/{option_id}", response_model=bool)
def delete_option(option_id: int, db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        deleted_option = service.delete_option(option_id)
        return deleted_option
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/options_total_count", response_model=int)
def total_options_route(db: Session = Depends(get_db)):
    try:
        service = OptionService(db)
        total_options = service.get_total_option()
        return total_options
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))