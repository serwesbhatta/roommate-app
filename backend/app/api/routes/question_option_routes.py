from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.question_option_schema import QuestionOptionResponse
from ...services.question_option_services import QuestionOptionService
from ...database import get_db

router = APIRouter()

@router.get("/question_options", response_model=QuestionOptionResponse)
def get_question_options_route(question_id: int, db: Session = Depends(get_db)):
    try:
        service = QuestionOptionService(db)
        question_options = service.get_question_with_options(question_id)
        return question_options
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/questions_options_list", response_model=List[QuestionOptionResponse])
def list_question_options_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = QuestionOptionService(db)
        question_options_list = service.list_question_with_options(skip=skip, limit=limit)
        return question_options_list
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))