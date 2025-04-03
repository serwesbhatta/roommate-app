from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.option_model import Option
from ..models.question_model import Question
from ..schemas.question_option_schema import QuestionOptionResponse
from ..crud.crud import (
    get_record_by_id, 
    get_all_records, 
)

class QuestionOptionService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_question_with_options(self, question_id: int) -> QuestionOptionResponse:
        filter_condition = Option.question_id == question_id
        skip = 0
        limit = 100

        options = get_all_records(
            db=self.db,
            model=Option,
            skip=skip,
            limit=limit,
            filter_condition=filter_condition
        )

        question = get_record_by_id(
            db=self.db,
            model=Question,
            record_id=question_id
        )

        if not question:
            raise ValueError(f"Question with question_id {question_id} not found.")
        
        response = QuestionOptionResponse(
            id=question_id,
            question_text=question.question_text,
            category=question.category,
            options=[option.text for option in options]
        )

        return response
    
    def list_question_with_options(self, skip: int = 0, limit: int = 100) -> List[QuestionOptionResponse]:
        questions = get_all_records(
            db=self.db,
            model=Question,
            skip=skip,
            limit=limit
        )

        questionsWithOptions = []

        for question in questions:
            filter_condition = Option.question_id == question.id

            options = get_all_records(
                db=self.db,
                model=Option,
                skip=skip,
                limit=limit,
                filter_condition=filter_condition
            )

            options_text = [option.option_text for option in options]

            reponse = QuestionOptionResponse(
                id=question.id,
                question_text=question.question_text,
                category=question.category,
                options=options_text
            )

            questionsWithOptions.append(reponse)
        
        return questionsWithOptions