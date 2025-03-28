from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.residence_hall import ResidenceHall
from ..schemas.residence_hall import ResidenceHallCreate, ResidenceHallUpdate
from ..crud.residence_hall import (
    create_record, 
    get_record_by_id, 
    get_all_records, 
    update_record, 
    delete_record
)

class ResidenceHallService:
    """
    Service layer for residence hall operations.
    Handles business logic and coordinates between 
    API layer and CRUD operations.
    """
    def __init__(self, db: Session):
        """
        Initialize the service with a database session.
        
        :param db: SQLAlchemy database session
        """
        self.db = db

    def create_residence_hall(self, residence_hall: ResidenceHallCreate) -> ResidenceHall:
        """
        Create a new residence hall with business logic.
        
        :param residence_hall: Pydantic model with residence hall details
        :return: Created ResidenceHall model instance
        """
        # Example of potential business logic
        # - Validate hall name uniqueness
        existing_hall = self.db.query(ResidenceHall).filter(
            ResidenceHall.name == residence_hall.name
        ).first()
        
        if existing_hall:
            raise ValueError(f"Residence hall with name {residence_hall.name} already exists")
        
        # Additional validation or preprocessing can be added here
        
        # Convert Pydantic model to dictionary for create_record
        hall_data = residence_hall.model_dump()
        
        return create_record(
            db=self.db, 
            model=ResidenceHall, 
            data=hall_data
        )

    def get_residence_hall(self, hall_id: int) -> Optional[ResidenceHall]:
        """
        Retrieve a residence hall by its ID.
        
        :param hall_id: ID of the residence hall
        :return: ResidenceHall instance or None
        """
        hall = get_record_by_id(
            db=self.db, 
            model=ResidenceHall, 
            record_id=hall_id
        )
        
        if not hall:
            raise ValueError(f"Residence hall with ID {hall_id} not found")
        
        return hall

    def list_residence_halls(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[ResidenceHall]:
        """
        List residence halls with pagination.
        
        :param skip: Number of records to skip
        :param limit: Maximum number of records to return
        :return: List of ResidenceHall instances
        """
        return get_all_records(
            db=self.db, 
            model=ResidenceHall, 
            skip=skip, 
            limit=limit
        )

    def update_residence_hall(
        self, 
        hall_id: int, 
        residence_hall_update: ResidenceHallUpdate
    ) -> ResidenceHall:
        """
        Update an existing residence hall.
        
        :param hall_id: ID of the residence hall to update
        :param residence_hall_update: Pydantic model with update details
        :return: Updated ResidenceHall instance
        """
        # Additional business logic can be added here
        # E.g., check permissions, validate update data
        
        # Convert Pydantic update model to dictionary
        update_data = residence_hall_update.model_dump(exclude_unset=True)
        
        updated_hall = update_record(
            db=self.db, 
            model=ResidenceHall, 
            record_id=hall_id, 
            update_data=update_data
        )
        
        if not updated_hall:
            raise ValueError(f"Residence hall with ID {hall_id} not found")
        
        return updated_hall

    def delete_residence_hall(self, hall_id: int) -> bool:
        """
        Delete a residence hall.
        
        :param hall_id: ID of the residence hall to delete
        :return: True if deletion was successful
        """
        # Additional business logic can be added here
        # E.g., check if hall is empty, check deletion permissions
        
        deletion_result = delete_record(
            db=self.db, 
            model=ResidenceHall, 
            record_id=hall_id
        )
        
        if not deletion_result:
            raise ValueError(f"Residence hall with ID {hall_id} not found")
        
        return True