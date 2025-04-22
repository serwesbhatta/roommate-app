from fastapi import WebSocket
from typing import Dict

class GroupConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_message(self, receiver_id: int, message: str):
        if receiver_id in self.active_connections:
            await self.active_connections[receiver_id].send_text(message)

    async def broadcast(self, message: str, exclude_user_id: int = None):
        """Send a message to all connected clients except the excluded one"""
        for user_id, connection in self.active_connections.items():
            if user_id != exclude_user_id:
                await connection.send_text(message)

group_manager = GroupConnectionManager()