from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from ..models.room import Room
from ..schemas.room import RoomCreate, RoomUpdate

def create_room(
    db: Session, 
    room: RoomCreate
) -> Room:
    """
    Create a new room in the database.
    
    :param db: Database session
    :param room: Pydantic model with room details
    :return: Created Room model instance
    """
    try:
        db_room = Room(**room.model_dump())
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return db_room
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error creating room: {str(e)}")

def get_room_by_id(
    db: Session, 
    room_id: int
) -> Optional[Room]:
    """
    Retrieve a room by its ID.
    
    :param db: Database session
    :param room_id: ID of the room
    :return: Room instance or None
    """
    return db.query(Room).filter(Room.id == room_id).first()

def get_rooms_by_residence_hall(
    db: Session, 
    residence_hall_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[Room]:
    """
    Retrieve rooms for a specific residence hall.
    
    :param db: Database session
    :param residence_hall_id: ID of the residence hall
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :return: List of Room instances
    """
    return (
        db.query(Room)
        .filter(Room.residence_hall_id == residence_hall_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_available_rooms(
    db: Session, 
    skip: int = 0, 
    limit: int = 100
) -> List[Room]:
    """
    Retrieve available rooms.
    
    :param db: Database session
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :return: List of available Room instances
    """
    return (
        db.query(Room)
        .filter(Room.is_available == True)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_room(
    db: Session, 
    room_id: int, 
    room_update: RoomUpdate
) -> Optional[Room]:
    """
    Update an existing room.
    
    :param db: Database session
    :param room_id: ID of the room to update
    :param room_update: Pydantic model with update details
    :return: Updated Room instance or None
    """
    try:
        db_room = db.query(Room).filter(Room.id == room_id).first()
        
        if not db_room:
            return None
        
        # Update only provided fields
        update_data = room_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_room, key, value)
        
        db.commit()
        db.refresh(db_room)
        return db_room
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error updating room: {str(e)}")

def delete_room(
    db: Session, 
    room_id: int
) -> bool:
    """
    Delete a room by its ID.
    
    :param db: Database session
    :param room_id: ID of the room to delete
    :return: True if deletion was successful, False otherwise
    """
    try:
        db_room = db.query(Room).filter(Room.id == room_id).first()
        
        if not db_room:
            return False
        
        db.delete(db_room)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error deleting room: {str(e)}")