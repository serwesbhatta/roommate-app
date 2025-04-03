from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.question_schema import QuestionCreate, QuestionResponse, QuestionUpdate
from ...services.question_services import QuestionService
from ...database import get_db

router = APIRouter()

@router.post("/questions", response_model=QuestionResponse)
def create_question_route(question: QuestionCreate, db: Session = Depends(get_db)):
    try:
        service = QuestionService(db)
        new_question = service.create_question(question)
        return new_question
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    try:
        service = QuestionService(db)
        question = service.get_question(question_id)
        return question
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/questions", response_model=List[QuestionResponse])
def list_questions_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = QuestionService(db)
        questions = service.list_question(skip, limit)
        return questions
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/questions/{question_id}", response_model=QuestionResponse)
def update_question_route(question_id: int, question: QuestionUpdate, db: Session = Depends(get_db)):
    try:
        service = QuestionService(db)
        updated_question = service.update_question(question_id, question)
        return updated_question
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/questions/{question_id}", response_model=bool)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    try:
        service = QuestionService(db)
        deleted_question = service.delete_question(question_id)
        return deleted_question
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))