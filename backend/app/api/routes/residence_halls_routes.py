from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.residence_hall_schema import ResidenceHallCreate, ResidenceHallUpdate, ResidenceHallResponse
from ...services.residence_hall_services import ResidenceHallService
from ...database import get_db

router = APIRouter()

@router.post("/residence-halls", response_model=ResidenceHallResponse)
def create_residence_hall_route(
    residence_hall: ResidenceHallCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new residence hall
    
    :param residence_hall: Details of the residence hall to create
    :param db: Database session dependency
    :return: Created residence hall
    """
    try:
        service = ResidenceHallService(db)
        new_hall = service.create_residence_hall(residence_hall)
        return new_hall
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/residence-halls/count")
def get_total_residence_halls_route(
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to get the total number of residence halls.
    """
    try:
        service = ResidenceHallService(db)
        total = service.get_total_residence_halls()
        return total
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/residence-halls/{hall_id}", response_model=ResidenceHallResponse)
def get_residence_hall_route(
    hall_id: int, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific residence hall by ID
    
    :param hall_id: ID of the residence hall
    :param db: Database session dependency
    :return: Residence hall details
    """
    try:
        service = ResidenceHallService(db)
        hall = service.get_residence_hall(hall_id)
        return hall
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/residence-halls", response_model=List[ResidenceHallResponse])
def list_residence_halls_route(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    List residence halls with pagination
    
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :param db: Database session dependency
    :return: List of residence halls
    """
    service = ResidenceHallService(db)
    return service.list_residence_halls(skip=skip, limit=limit)

@router.put("/residence-halls/{hall_id}", response_model=ResidenceHallResponse)
def update_residence_hall_route(
    hall_id: int, 
    residence_hall: ResidenceHallUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an existing residence hall
    
    :param hall_id: ID of the residence hall to update
    :param residence_hall: Updated details
    :param db: Database session dependency
    :return: Updated residence hall
    """
    try:
        service = ResidenceHallService(db)
        updated_hall = service.update_residence_hall(hall_id, residence_hall)
        return updated_hall
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/residence-halls/{hall_id}")
def delete_residence_hall_route(
    hall_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a residence hall
    
    :param hall_id: ID of the residence hall to delete
    :param db: Database session dependency
    :return: Deletion confirmation
    """
    try:
        service = ResidenceHallService(db)
        service.delete_residence_hall(hall_id)
        return {"message": "Residence hall deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    



    
