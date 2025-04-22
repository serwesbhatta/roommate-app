import asyncio
import json
from fastapi import WebSocket
from typing import Dict
from datetime import datetime, timezone
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, ws: WebSocket):
        await ws.accept()
        self.active_connections[user_id] = ws
        # announce “online”
        await self.broadcast_presence(user_id, True)

    def disconnect(self, user_id: int):
        # remove socket
        self.active_connections.pop(user_id, None)
        # announce “offline” asynchronously
        asyncio.create_task(self.broadcast_presence(user_id, False))

    async def send_message(self, receiver_id: int, message: str):
        """
        Send a chat payload to a single connected user.
        """
        ws = self.active_connections.get(receiver_id)
        if ws:
            try:
                await ws.send_text(message)
            except WebSocketDisconnect:
                # if they disconnected unexpectedly, clean up
                self.disconnect(receiver_id)

    async def broadcast_presence(self, user_id: int, is_online: bool):
        """
        Let everyone else know this user went online/offline.
        """
        payload = json.dumps({
            "type":      "presence",
            "user_id":   user_id,
            "is_online": is_online,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        for uid, socket in list(self.active_connections.items()):
            if uid != user_id:
                try:
                    await socket.send_text(payload)
                except WebSocketDisconnect:
                    self.disconnect(uid)
                    
manager = ConnectionManager()
