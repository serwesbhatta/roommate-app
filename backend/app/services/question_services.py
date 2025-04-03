from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.question_model import Question
from ..schemas.question_schema import QuestionCreate, QuestionUpdate, QuestionResponse
from ..crud.crud import (
    create_record, 
    get_record_by_id, 
    get_all_records, 
    update_record, 
    delete_record,
    get_count
)

class QuestionService:
    def __init__(self, db: Session):
        self.db = db

    def create_question(self, question: QuestionCreate) -> Question:
        existing_question = self.db.query(Question).filter(
            Question.question_text == question.question_text
        ).first()

        if existing_question:
            raise ValueError(f"Question already exist!")
        
        question_data = question.model_dump()

        return create_record(
            db=self.db,
            model=Question,
            data=question_data
        )
    
    def get_question(self, question_id: int) -> Optional[Question]:
        question = get_record_by_id(
            db=self.db,
            model=Question,
            record_id=question_id
        )

        if not question:
            raise ValueError(f"Question with the question id {question_id} not found.")
        
        return question
    
    def list_question(self, skip: int = 0, limit: int = 100) -> List[Question]:
        return get_all_records(
            db=self.db,
            model=Question,
            skip=skip,
            limit=limit
        )
    
    def update_question(self, question_id: int, question: QuestionUpdate) -> Question:
        update_data = question.model_dump(exclude_unset=True)

        updated_question = update_record(
            db=self.db,
            model=Question,
            record_id=question_id,
            update_data=update_data
        )

        if not updated_question:
            raise ValueError(f"Question with question id {question_id} not found.")
        
        return updated_question

    
    def delete_question(self, question_id: int) -> bool:
        deleted_question = delete_record(
            db=self.db,
            model=Question,
            record_id=question_id
        )

        if not deleted_question:
            raise ValueError(f"Question with question id {question_id} not found!")
        
        return True
    
    def get_total_question(self) -> int:
        total_question = get_count(
            db=self.db,
            model=Question
        )

        if total_question is None:
            raise ValueError("Couldm not fetch total count of questions.")
        
        return total_question