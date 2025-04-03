from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Type, TypeVar
from sqlalchemy.sql.expression import BinaryExpression

T = TypeVar('T')

def create_record(
    db: Session, 
    model: Type[T], 
    data: dict
) -> T:
    """
    Generic create method for creating a new database record.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param data: Dictionary of record attributes
    :return: Created model instance
    """
    try:
        db_record = model(**data)
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error creating record: {str(e)}")

def get_record_by_id(
    db: Session, 
    model: Type[T], 
    record_id: int
) -> Optional[T]:
    """
    Generic method to retrieve a record by its ID.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param record_id: ID of the record
    :return: Record instance or None
    """
    return db.query(model).filter(model.id == record_id).first()

def get_all_records(
    db: Session, 
    model: Type[T], 
    skip: int = 0, 
    limit: int = 100,
    filter_condition: Optional[BinaryExpression] = None
) -> List[T]:
    """
    Generic method to retrieve multiple records with pagination.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param skip: Number of records to skip
    :param limit: Maximum number of records to return
    :return: List of record instances
    """
    query = db.query(model)

    if filter_condition:
        query = query.filter(filter_condition)
    
    return query.offset(skip).limit(limit).all()

def update_record(
    db: Session, 
    model: Type[T], 
    record_id: int, 
    update_data: dict
) -> Optional[T]:
    """
    Generic method to update an existing record.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param record_id: ID of the record to update
    :param update_data: Dictionary of fields to update
    :return: Updated record instance or None
    """
    try:
        db_record = db.query(model).filter(model.id == record_id).first()
        
        if not db_record:
            return None
        
        for key, value in update_data.items():
            setattr(db_record, key, value)
        
        db.commit()
        db.refresh(db_record)
        return db_record
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error updating record: {str(e)}")

def delete_record(
    db: Session, 
    model: Type[T], 
    record_id: int
) -> bool:
    """
    Generic method to delete a record by its ID.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :param record_id: ID of the record to delete
    :return: True if deletion was successful, False otherwise
    """
    try:
        db_record = db.query(model).filter(model.id == record_id).first()
        
        if not db_record:
            return False
        
        db.delete(db_record)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error deleting record: {str(e)}")
    
def get_count(
    db: Session,
    model: Type[T],
    filter_condition: Optional[BinaryExpression] = None
) -> int:
    """
    Generic method to get total record.
    If you want to apply filter then pass the filter_condition.
    If you want to get total count then do not pass any filter_condition.
    
    :param db: Database session
    :param model: SQLAlchemy model class
    :filter_condition: Filters the data queried from db.
    """
    try:
        query = db.query(model)

        if filter_condition is not None:
            query = query.filter(filter_condition)
        
        total_count = query.count()
        return total_count
    except SQLAlchemyError as e:
        db.rollback()
        raise ValueError(f"Error fetching total count from db: {str(e)}")