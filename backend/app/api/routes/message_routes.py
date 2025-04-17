from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List
from sqlalchemy.orm import Session
from app.websockets.chat_ws import manager
from app.schemas.message_schema import MessageCreate, MessageResponse
from app.services.message_services import MessageService
from app.database import get_db
import json

router = APIRouter()

@router.get(
    "/messages/{current_user_id}/{other_user_id}",
    response_model=List[MessageResponse]
)
async def get_chat_history(
    current_user_id: int,
    other_user_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    message_service = MessageService(db)
    messages = message_service.get_chat_history(
        user_id=current_user_id,
        other_user_id=other_user_id,
        skip=skip,
        limit=limit
    )
    
    return messages

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    user_id: int, 
    db: Session = Depends(get_db)
):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Parse the received JSON data
            try:
                message_data = json.loads(data)
                # Validate required fields
                if not all(key in message_data for key in ["receiver_id", "content"]):
                    await websocket.send_text(json.dumps({
                        "status": "error",
                        "message": "Message must contain receiver_id and content"
                    }))
                    continue
                
                # Create message object
                message_create = MessageCreate(
                    sender_id=user_id,
                    receiver_id=message_data["receiver_id"],
                    content=message_data["content"]
                )
                
                # Save to database
                message_service = MessageService(db)
                saved_message = message_service.send_message(message_create)
                
                # Format message for sending
                message_to_send = {
                    "id": saved_message.id,
                    "sender_id": saved_message.sender_id,
                    "content": saved_message.content,
                    "timestamp": saved_message.timestamp.isoformat()
                }
                
                # Send to receiver if they're connected
                await manager.send_message(
                    receiver_id=message_data["receiver_id"], 
                    message=json.dumps(message_to_send)
                )
                
                # Send confirmation back to sender
                await websocket.send_text(json.dumps({
                    "status": "success",
                    "message": "Message sent",
                    "data": message_to_send
                }))
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "status": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                await websocket.send_text(json.dumps({
                    "status": "error",
                    "message": f"Error: {str(e)}"
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get(
    "/messages-contacts/{current_user_id}",
)
async def get_chat_contacts(
    current_user_id: int,
    db: Session = Depends(get_db),
):
    message_service = MessageService(db)
    contacts = message_service.get_chat_contacts(
        user_id=current_user_id
    )
    
    # Convert to response format with only necessary fields
    return [
        {
            "id": contact.id,
            "first_name": contact.first_name,
            "last_name": contact.last_name,
            "profile_image": contact.profile_image
        }
        for contact in contacts
    ]