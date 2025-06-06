from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi import Body
from typing import List

from ...schemas.room_schema import RoomCreate, RoomUpdate, RoomResponse, StudentIDs
from ...services.room_services import RoomService
from ...database import get_db

router = APIRouter()

@router.post("/rooms", response_model=RoomResponse)
def create_room_route(room: RoomCreate, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        new_room = service.create_room(room)
        return new_room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/rooms/{residence_hall_id}/{room_number}", response_model=RoomResponse)
def get_room_route(room_number: int, residence_hall_id: int, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        room = service.get_room(room_number=room_number, residence_hall_id=residence_hall_id)
        return room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/rooms", response_model=List[RoomResponse])
def list_rooms_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        rooms = service.list_rooms(
            skip=skip,
            limit=limit
        )
        return rooms
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    

@router.put("/rooms/{residence_hall_id}/{room_number}", response_model=RoomResponse)
def update_room_route(room_number: int, residence_hall_id: int, room: RoomUpdate, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        updated_room = service.update_room(
            room_number=room_number,
            residence_hall_id=residence_hall_id,
            room_update=room
        )
        return updated_room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/rooms/{residence_hall_id}/{room_number}", response_model=bool)
def delete_room_route(room_number: int, residence_hall_id: int, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        deleted_room = service.delete_room(
            room_number=room_number,
            residence_hall_id=residence_hall_id
        )
        if deleted_room:
            return True
        
        return False
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/rooms_total_count", response_model=int)
def get_total_rooms_route(db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        total_rooms = service.get_total_rooms()

        return total_rooms
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/rooms_available_count", response_model=int)
def get_available_rooms_route(db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        available_rooms = service.get_available_rooms()

        return available_rooms
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.post("/rooms/{residence_hall_id}/{room_number}/allocate")
def allocate_students_route(
    room_number: int,
    residence_hall_id: int,
    student_data: StudentIDs,  
    db: Session = Depends(get_db)
):
    try:
        service = RoomService(db)
        updated_room = service.allocate_students_to_room(room_number, residence_hall_id, student_data.student_ids)
        return updated_room
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/rooms/{residence_hall_id}/{room_number}/vacate", response_model=RoomResponse)
def vacate_room_route(
    room_number: int,
    residence_hall_id: int,
    student_data: StudentIDs,  
    db: Session = Depends(get_db)
):
    """
    Vacate one or more students from a room when a lease expires or upon student departure,
    updating occupancy details and freeing allocations as necessary.
    """
    try:
        service = RoomService(db)
        updated_room = service.vacate_room(room_number, residence_hall_id, student_data.student_ids)
        return updated_room
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}/room", response_model=RoomResponse)
def get_user_room_route(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetch the room that the given user is allocated to.
    If the user has no room, returns 404.
    """
    try:
        service = RoomService(db)
        room = service.get_room_for_user(user_id)
        return room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
