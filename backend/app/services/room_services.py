from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import date

from ..models.room_model import Room
from ..models.user_model import UserProfile
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
            room_number=room_number,
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
            room_number=room_number,
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
            room_number=room_number,
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
    


    def allocate_students_to_room(self, room_number: int, residence_hall_id: int, student_ids: List[int]) -> Room:
        room = self.get_room(room_number=room_number, residence_hall_id=residence_hall_id)
        if room.current_occupants + len(student_ids) > room.capacity:
            raise ValueError("Insufficient capacity in this room for the requested number of students.")
        
        # Fetch user objects for the given IDs
        allocated_users = self.db.query(UserProfile).filter(UserProfile.id.in_(student_ids)).all()
        if len(allocated_users) != len(student_ids):
            raise ValueError("One or more user IDs were not found in the database.")
        
        # Create a set of existing occupant IDs from the current relationship
        existing_ids = {user.id for user in room.user_profiles}

        # Filter out any user whose id is already in the room
        new_users = [user for user in allocated_users if user.id not in existing_ids]

        if not new_users:
            # If there are no new users to add, you may choose to simply return the room 
            # or raise an error informing that the students are already allocated.
            raise ValueError("All provided student IDs are already allocated to this room.")

        # Allocate the new students by extending the occupants list
        room.user_profiles.extend(new_users)
        room.current_occupants += len(new_users)
        
        remaining_capacity = room.capacity - room.current_occupants
        room.is_available = remaining_capacity > 0
        room.room_status = "full" if remaining_capacity == 0 else "partially_occupied"
        
        # Commit the changes and refresh the room from the DB
        self.db.commit()
        self.db.refresh(room)
        return room

    
    def vacate_room(self, room_number: int, residence_hall_id: int, student_ids: List[int]) -> Room:
        room = self.get_room(room_number, residence_hall_id)

        # Gather the IDs of the current occupants
        current_ids = {user.id for user in room.user_profiles}
        
        # Determine which provided student_ids are not in the room
        missing_ids = [sid for sid in student_ids if sid not in current_ids]
        if missing_ids:
            raise ValueError(f"Student IDs {missing_ids} are not allocated to this room.")

        # If all IDs are present, remove the students from the room occupants
        room.user_profiles = [user for user in room.user_profiles if user.id not in student_ids]

        # Update the current occupants count
        room.current_occupants = len(room.user_profiles)
            
        # Update room availability and status based on the new occupant count
        room.is_available = room.current_occupants < room.capacity
        room.room_status = "available" if room.is_available else "full"

        # Commit the changes to the database
        try:
            self.db.commit()
            self.db.refresh(room)
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error during vacating process: {str(e)}")
        
        return room
    
    def get_room_for_user(self, user_id: int) -> Room:
        """
        Return the RoomModel instance where this user_id is one of the occupants.
        Raises ValueError if none found.
        """
        room = (
            self.db
            .query(Room)
            # assuming RoomModel.user_profiles is a relationship to UserProfileModel
            .filter(Room.user_profiles.any(id=user_id))
            .first()
        )
        if not room:
            raise ValueError(f"No room allocated for user with id {user_id}")
        return room
