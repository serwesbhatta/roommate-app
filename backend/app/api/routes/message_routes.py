from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websockets.chat_ws import manager

router = APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(receiver_id=user_id, message=f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user_id)
