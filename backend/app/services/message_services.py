from sqlalchemy.orm import Session
from ..schemas.message_schema import MessageCreate, MessageResponse
from ..schemas.auth_schema import CurrentUser
from ..crud import message_crud

class MessageService:
    def __init__(self, db: Session, current_user: CurrentUser):
        self.db = db
        self.current_user = current_user

    def send_message(self, message: MessageCreate) -> MessageResponse:
        return message_crud.create_message(
            db=self.db,
            sender_id=self.current_user["user_id"],
            message=message
        )
