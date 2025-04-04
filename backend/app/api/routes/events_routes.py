from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.event_schema import EventCreate, EventResponse, EventUpdate
from ...services.event_services import EventService
from ...database import get_db

router = APIRouter()

@router.post("/events", response_model=EventResponse)
def create_event_route(event: EventCreate, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        new_event = service.create_event(event)
        return new_event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/events/{event_id}", response_model=EventResponse)
def get_event_route(event_id: int, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        event = service.get_event(event_id=event_id)
        return event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/events", response_model=List[EventResponse])
def list_event_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        events = service.list_event(skip=skip, limit=limit)
        return events
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.put("/events/{event_id}", response_model=EventResponse)
def update_event_route(event_id: int, event: EventUpdate, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        updated_event = service.update_event(event_id=event_id, event_update=event)
        return updated_event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/events/{event_id}", response_model=bool)
def delete_event_route(event_id: int, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        deleted_event = service.delete_event(event_id=event_id)

        if deleted_event:
            return True
        
        return False
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/events_total_count", response_model=int)
def total_events_route(db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        total_events = service.get_total_events()
        return total_events
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/events_pending", response_model=List[EventResponse])
def pending_events_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        pending_events = service.get_pending_events(skip, limit)
        return pending_events
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/events_approved", response_model=List[EventResponse])
def approved_events_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        service = EventService(db)
        approved_events = service.get_approved_events(skip, limit)
        return approved_events
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    