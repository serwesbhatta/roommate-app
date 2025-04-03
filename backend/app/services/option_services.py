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