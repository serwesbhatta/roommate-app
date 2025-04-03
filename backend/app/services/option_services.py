from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.option_model import Option
from ..schemas.option_schema import OptionCreate, OptionUpdate, OptionResponse
from ..crud.crud import (
    create_record, 
    get_record_by_id, 
    get_all_records, 
    update_record, 
    delete_record,
    get_count
)

class OptionService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_option(self, option: OptionCreate) -> Option:
        existing_option = self.db.query(Option).filter(
            Option.option_text == option.option_text,
            Option.question_id == option.question_id
        ).first()

        if existing_option:
            raise ValueError(f"Option '{option.option_text}' already exist.")
        
        option_data = option.model_dump()

        return create_record(
            db=self.db,
            model=Option,
            data=option_data
        )
    
    def get_option(self, option_id: int) -> Optional[Option]:
        option = get_record_by_id(
            db=self.db,
            model=Option,
            record_id=option_id,
        )

        if not option:
            raise ValueError(f"Could not find the option with option id {option_id}")
        
        return option

    def list_option(self, skip: int = 0, limit: int = 100) -> List[OptionResponse]:
        return get_all_records(
            db=self.db,
            model=Option,
            skip=skip,
            limit=limit
        )
    
    def update_option(self, option_id: int, new_option: OptionUpdate) -> OptionResponse:
        update_data = new_option.model_dump()

        updated_option = update_record(
            db=self.db,
            model=Option,
            record_id=option_id,
            update_data=update_data
        )

        if not updated_option:
            raise ValueError(f"Option with option id {option_id} could not be updated.")
        
        return updated_option

    def delete_option(self, option_id: int) -> bool:
        deleted_option = delete_record(
            db=self.db,
            model=Option,
            record_id=option_id
        ) 

        if not deleted_option:
            raise ValueError(f"Option with option id {option_id} could not be deleted.")
        
        return deleted_option

    def get_total_option(self) -> int:
        total_option = get_count(
            db=self.db,
            model=Option
        )

        if total_option is None:
            raise ValueError("Total count of option could not be calculated.")
        
        return total_option