from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.room_model import Room
from ..schemas.room_schema import RoomCreate, RoomUpdate
from ..crud.room_crud import (
    create_room,
    get_all_rooms,
    get_room_by_id,
    update_room,
    delete_room,
    get_total_rooms,
    get_available_rooms
)

class RoomService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_room(self, room: RoomCreate) -> Room:
        existingRoom = self.db.query(Room).filter(
            Room.room_number == room.room_number,
            Room.residence_hall_id == room.residence_hall_id
        ).first()

        if existingRoom:
            raise ValueError(f"Room with the room number {room.room_number} and in the same Residence Hall {room.residence_hall_id} already exists.")
        
        room_data = room.model_dump()

        return create_room (
            db=self.db,
            model=Room,
            data=room_data
        )
    
    def get_room(self, room_number: int, residence_hall_id: int) -> Optional[Room]:
        room = get_room_by_id(
            db=self.db,
            model=Room,
            room_id=room_number,
            residence_hall_id=residence_hall_id
        )

        if not room:
            raise ValueError(f"Room with the room number {room_number} is not found.")
        
        return room
    
    def list_rooms(self, skip: int = 0, limit: int = 100) -> List[Room]:
        return get_all_rooms(
            db=self.db,
            model=Room,
            skip=skip,
            limit=limit
        )
    
    def update_room(self, room_number: int, residence_hall_id: int, room_update: RoomUpdate) -> Room:
        update_data = room_update.model_dump(exclude_unset=True)

        updated_room = update_room(
            db=self.db,
            model=Room,
            room_id=room_number,
            residence_hall_id=residence_hall_id,
            update_data=update_data
        )

        if not updated_room:
            raise ValueError(f"Room with room number {room_number} not found.")
        
        return updated_room
    
    def delete_room(self, room_number: int, residence_hall_id: int) -> bool:
        deleted_room = delete_room(
            db=self.db,
            model=Room,
            room_id=room_number,
            residence_hall_id=residence_hall_id
        )

        if not deleted_room:
            raise ValueError(f"Room with the room number {room_number} not found.")
        
        return True

    def get_total_rooms(self) -> int:
        total_rooms = get_total_rooms(db=self.db, model=Room)

        if total_rooms is None:
            raise ValueError(f"Cannot fetch total rooms.")
        
        return total_rooms

    def get_available_rooms(self) -> int:
        available_rooms = get_available_rooms(db=self.db, model=Room)

        if available_rooms is None:
            raise ValueError(f"Couldn't get available rooms.")
        
        return available_rooms