from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from ..models.room_model import Room

def create_room(
    db: Session, 
    model: Room, 
    data: dict
) -> Room:
    """
    Generic create method for creating a new database room.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param data: Dictionary of room attributes
    :return: Created model instance
    """
    try:
        db_room = model(**data)
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return db_room
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error creating room: {str(e)}")

def get_room_by_id(
    db: Session, 
    model: Room, 
    room_number: int,
    residence_hall_id: int
) -> Optional[Room]:
    """
    Generic method to retrieve a room by its ID.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param room_id: ID of the room
    :return: room instance or None
    """
    return db.query(model).filter(model.room_number == room_number, model.residence_hall_id == residence_hall_id).first()

def get_all_rooms(
    db: Session, 
    model: Room, 
    skip: int = 0, 
    limit: int = 100
) -> List[Room]:
    """
    Generic method to retrieve multiple rooms with pagination.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param skip: Number of rooms to skip
    :param limit: Maximum number of rooms to return
    :return: List of room instances
    """
    return db.query(model).offset(skip).limit(limit).all()

def update_room(
    db: Session, 
    model: Room, 
    room_number: int,
    residence_hall_id: int,
    update_data: dict
) -> Optional[Room]:
    """
    Generic method to update an existing room.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param room_id: ID of the room to update
    :param update_data: Dictionary of fields to update
    :return: Updated room instance or None
    """
    try:
        db_room = db.query(model).filter(model.room_number == room_number, model.residence_hall_id == residence_hall_id).first()
        
        if not db_room:
            return None
        
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
    model: Room, 
    room_number: int,
    residence_hall_id: int
) -> bool:
    """
    Generic method to delete a room by its ID.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param room_id: ID of the room to delete
    :return: True if deletion was successful, False otherwise
    """
    try:
        db_room = db.query(model).filter(model.room_number == room_number, model.residence_hall_id == residence_hall_id).first()
        
        if not db_room:
            return False
        
        db.delete(db_room)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error deleting room: {str(e)}")