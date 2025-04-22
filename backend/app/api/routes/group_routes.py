from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from app.database import get_db
from app.schemas.group_schema import GroupCreate, GroupResponse, GroupDetail, GroupMessageCreate, GroupMessageResponse, GroupMessageWithSender
from app.services.group_services import GroupService, GroupMessageService
from app.models.user_model import UserProfile
from app.websockets.group_chat_ws import group_manager
from app.models.message_model import ChatGroup, group_members, GroupMessage  

router = APIRouter()

@router.post("/groups", response_model=GroupResponse)
async def create_group(
    group_data: GroupCreate,
    db: Session = Depends(get_db)
):
    # Verify the creator exists
    creator = db.query(UserProfile).filter(UserProfile.id == group_data.creator_id).first()
    if not creator:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Creator not found")
    
    # Verify all members exist
    for member_id in group_data.member_ids:
        member = db.query(UserProfile).filter(UserProfile.id == member_id).first()
        if not member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Member with ID {member_id} not found")
    
    group_service = GroupService(db)
    created_group = group_service.create_group(group_data)
    return created_group

@router.get("/groups/{group_id}", response_model=GroupResponse)
async def get_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    group_service = GroupService(db)
    group = group_service.get_group(group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    return group

@router.get("/users/{user_id}/groups", response_model=List[GroupDetail])
async def get_user_groups(
    user_id: int,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    group_service = GroupService(db)
    groups = group_service.get_group_with_last_message(user_id)
    return groups

@router.post("/groups/{group_id}/members/{user_id}")
async def add_group_member(
    group_id: int,
    user_id: int,
    is_admin: bool = False,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    group_service = GroupService(db)
    
    # Check if group exists
    group = group_service.get_group(group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
    result = group_service.add_member(group_id, user_id, is_admin)
    if not result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already a member of this group")
    
    return {"status": "success", "message": "Member added to group"}

@router.delete("/groups/{group_id}/members/{user_id}")
async def remove_group_member(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    group_service = GroupService(db)
    
    # Check if group exists
    group = group_service.get_group(group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
    result = group_service.remove_member(group_id, user_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a member of this group")
    
    return {"status": "success", "message": "Member removed from group"}

@router.get("/groups/{group_id}/messages", response_model=List[GroupMessageWithSender])
async def get_group_messages(
    group_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    group_service = GroupService(db)
    message_service = GroupMessageService(db)
    
    # Check if group exists
    group = group_service.get_group(group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    
    # Get messages
    messages = message_service.get_group_messages(group_id, skip, limit)
    
    # Format messages with sender info
    result = []
    for msg in messages:
        sender = None
        if msg.sender_id:
            sender = db.query(UserProfile).filter(UserProfile.id == msg.sender_id).first()
        
        message_data = {
            "id": msg.id,
            "group_id": msg.group_id,
            "sender_id": msg.sender_id,
            "content": msg.content,
            "timestamp": msg.timestamp,
            "sender_name": f"{sender.first_name or ''} {sender.last_name or ''}".strip() if sender else None,
            "sender_image": sender.profile_image if sender else None
        }
        result.append(message_data)
    
    return result

@router.put("/groups/{group_id}")
async def update_group(
    group_id: int,
    name: str,
    db: Session = Depends(get_db)
):
    group_service = GroupService(db)
    
    # Check if group exists
    group = group_service.get_group(group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
    result = group_service.update_group_name(group_id, name)
    return {"status": "success", "message": "Group updated"}


@router.websocket("/ws/group/{user_id}")
async def websocket_group_endpoint(
    websocket: WebSocket, 
    user_id: int, 
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    await group_manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message_data = json.loads(data)
                
                # Validate required fields
                if not all(key in message_data for key in ["group_id", "content"]):
                    await websocket.send_text(json.dumps({
                        "status": "error",
                        "message": "Message must contain group_id and content"
                    }))
                    continue
                
                group_id = message_data["group_id"]
                content = message_data["content"]
                
                # Check if user is in the group
                group_service = GroupService(db)
                if not group_service.is_user_in_group(group_id, user_id):
                    await websocket.send_text(json.dumps({
                        "status": "error",
                        "message": "You are not a member of this group"
                    }))
                    continue
                
                # Create message
                message_service = GroupMessageService(db)
                message_create = GroupMessageCreate(
                    group_id=group_id,
                    sender_id=user_id,
                    content=content
                )
                
                # Save to database
                saved_message = message_service.send_message(message_create)
                
                # Get sender information
                sender = db.query(UserProfile).filter(UserProfile.id == user_id).first()
                
                # Format message for sending
                message_to_send = {
                    "id": saved_message.id,
                    "group_id": saved_message.group_id,
                    "sender_id": saved_message.sender_id,
                    "content": saved_message.content,
                    "timestamp": saved_message.timestamp.isoformat(),
                    "sender_name": f"{sender.first_name or ''} {sender.last_name or ''}".strip() if sender else None,
                    "sender_image": sender.profile_image if sender else None
                }
                
                # Get all members of the group
                members = (
                    db.query(group_members.c.user_id)
                    .filter(group_members.c.group_id == group_id)
                    .all()
                )
                
                member_ids = [member[0] for member in members]
                
                # Send to all group members who are connected
                for member_id in member_ids:
                    if member_id != user_id:  # Don't send to the sender
                        await group_manager.send_message(
                            receiver_id=member_id,
                            message=json.dumps({
                                "type": "group_message",
                                "data": message_to_send
                            })
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
        group_manager.disconnect(user_id)
