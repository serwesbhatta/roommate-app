from sqlalchemy.orm import Session
from ..models.message_model import Message
from ..schemas.message_schema import MessageCreate

def create_message(db: Session, message: MessageCreate):
    db_message = Message(
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
