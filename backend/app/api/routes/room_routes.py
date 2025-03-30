from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.room_schema import RoomCreate, RoomUpdate, RoomResponse
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
    
@router.get("/rooms", response_model=RoomResponse)
def list_rooms_route(skip: int, limit: int, db: Session = Depends(get_db)):
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

@router.delete("/rooms/{residence_hall_id}/{room_id}")
def delete_room_route(room_number: int, residence_hall_id: int, db: Session = Depends(get_db)):
    try:
        service = RoomService(db)
        deleted_room = service.delete_room(
            room_number=room_number,
            residence_hall_id=residence_hall_id
        )
        if deleted_room:
            return {"Successfully deleted room"}
        
        return {"Couldn't delete room."}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))