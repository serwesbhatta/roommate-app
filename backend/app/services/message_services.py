from sqlalchemy.orm import Session
from ..models.message_model import Message
from ..models.user_model import UserProfile
from ..schemas.message_schema import MessageCreate, MessageResponse
from ..crud.crud import create_record

class MessageService:
    def __init__(self, db: Session):
        self.db = db

    def send_message(self, message: MessageCreate) -> MessageResponse:
        message_data = message.model_dump()

        return create_record(
            db=self.db,
            model=Message,
            data=message_data
        )
    
    def get_chat_history(self, user_id: int, other_user_id: int, skip: int = 0, limit: int = 50):
        messages = (
            self.db.query(Message)
            .filter(
                (
                    ((Message.sender_id == user_id) & (Message.receiver_id == other_user_id)) |
                    ((Message.sender_id == other_user_id) & (Message.receiver_id == user_id))
                )
            )
            .order_by(Message.timestamp.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return messages
    
    def get_chat_contacts(self, user_id: int):
        # Find all unique users that the current user has sent messages to
        sent_to = (
            self.db.query(Message.receiver_id)
            .filter(Message.sender_id == user_id)
            .distinct()
            .all()
        )
        
        # Find all unique users that have sent messages to the current user
        received_from = (
            self.db.query(Message.sender_id)
            .filter(Message.receiver_id == user_id)
            .distinct()
            .all()
        )
        
        # Combine and remove duplicates
        contact_ids = set([user_id for (user_id,) in sent_to] + 
                        [user_id for (user_id,) in received_from])
        
        # Get the actual user profiles
        contacts = (
            self.db.query(UserProfile)
            .filter(UserProfile.id.in_(contact_ids))
            .all()
        )
        
        return contacts