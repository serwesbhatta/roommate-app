from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from ..models.event_model import Event
from ..schemas.event_schema import EventCreate, EventResponse, EventUpdate
from ..crud.crud import (
    create_record, 
    get_record_by_id, 
    get_all_records, 
    update_record, 
    delete_record,
    get_count
)


class EventService:
    def __init__(self, db: Session):
        self.db = db

    def create_event(self, event: EventCreate) -> EventResponse:
        existingEvent = self.db.query(Event).filter(
            Event.title == event.title
        ).first()

        if existingEvent:
            raise ValueError(f"Event {event.title} already created.")
        
        event_data = event.model_dump()

        return create_record(
            db=self.db,
            model=Event,
            data=event_data
        )

    def get_event(self, event_id: int) -> EventResponse:
        event = get_record_by_id(
            db=self.db,
            model=Event,
            record_id=event_id,
        )

        if not event:
            raise ValueError(f"Event with event id {event_id} doesn't exist.")
                
        return event
    
    def list_event(self, skip: int = 0, limit: int = 100) -> List[EventResponse]:
        return get_all_records(
            db=self.db,
            model=Event,
            skip=skip,
            limit=limit
        )

    def update_event(self, event_id: int, event_update: EventUpdate) -> EventResponse:
        update_data = event_update.model_dump()

        updated_event = update_record(
            db=self.db,
            model=Event,
            record_id=event_id,
            update_data=update_data
        )

        if not updated_event:
            raise ValueError(f"Event with event id {event_id} not found.")
        
        return updated_event
    
    def delete_event(self, event_id: int) -> bool:
        deleted_event = delete_record(
            db=self.db,
            model=Event,
            record_id=event_id,
        )

        if not deleted_event:
            raise ValueError(f"Event with event id {event_id} not found.")
        
        return True
    
    def get_total_events(self) -> int:
        total_event = get_count(
            db=self.db,
            model=Event
        )

        if total_event is None:
            raise ValueError(f"Cannot fetch total events.")

        return total_event
    
    def get_pending_events(self) -> int:
        filter_condition = Event.status == "pending"
        pending_events = get_count(
            db=self.db,
            model=Event,
            filter_condition=filter_condition
        )

        return pending_events
    
    def get_approved_events(self) -> int:
        filter_condition = Event.status == "approved"
        approved_events = get_count(
            db=self.db,
            model=Event,
            filter_condition=filter_condition
        )

        return approved_events