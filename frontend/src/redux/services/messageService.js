import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

// WebSocket singleton instance
let ws = null;
let wsReconnectTimer = null;
const MAX_RECONNECT_DELAY = 5000;
let reconnectAttempts = 0;

class MessageService {
  // Get chat history between current user and another user
  async getChatHistory(currentUserId, otherUserId, skip = 0, limit = 100) {
    const response = await axios.get(
      `${API_ENDPOINTS.BASE_URL}/messages/${currentUserId}/${otherUserId}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  // Get all chat contacts for the current user
  async getChatContacts(userId) {
    const response = await axios.get(
      `${API_ENDPOINTS.BASE_URL}/messages-contacts/${userId}`
    );
    return response.data;
  }

// In messageService.js - Improve the sendMessage method to handle errors better
sendMessage(messageData) {
  return new Promise((resolve, reject) => {
    // Generate a temporary ID to track this message
    const tempId = `tmp-${Date.now()}`;
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected, attempting to reconnect...');
      
      this.connectWebSocket(
        messageData.sender_id || 'unknown',
        null,
        () => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            const messageWithIds = {
              ...messageData,
              temp_id: tempId,
              timestamp: new Date().toISOString()
            };
            
            ws.send(JSON.stringify(messageWithIds));
            resolve({ sent: true, temp_id: tempId });
          } else {
            reject(new Error('Failed to reconnect WebSocket'));
          }
        },
        () => reject(new Error('WebSocket reconnection failed'))
      );
      return;
    }

    const messageWithIds = {
      ...messageData,
      temp_id: tempId,
      timestamp: new Date().toISOString()
    };

    try {
      ws.send(JSON.stringify(messageWithIds));
      resolve({ sent: true, temp_id: tempId });
    } catch (error) {
      console.error('Error sending message:', error);
      reject(error);
    }
  });
}
// In messageService.js, improve the connectWebSocket method

connectWebSocket(userId, onMessageReceived, onConnected, onDisconnected) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('WebSocket already connected');
    if (onConnected) onConnected();
    return ws;
  }

  const wsUrl = `ws://localhost:8000/api/ws/${userId}`;
  console.log(`Connecting to WebSocket at ${wsUrl}`);
  
  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;
      if (onConnected) onConnected();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Handle different types of responses
        if (data.status === 'success' && data.data) {
          // Success confirmation from server after sending a message
          console.log("[WS confirm] server ts:", data.data.timestamp);
          console.log('Message sent successfully:', data);
          
          // Important: Process the confirmed message data the same way as incoming messages
          const confirmedMessage = {
            ...data.data,
            // Ensure timestamp is formatted consistently
            formatted_time: data.data.timestamp ? 
              new Date(data.data.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : undefined
          };

          console.log("confirmedMessage",confirmedMessage)
          
          if (onMessageReceived) onMessageReceived(confirmedMessage);
        } else if (data.status === 'error') {
          // Error message from server
          console.error('WebSocket error:', data.message);
        } else {
          // Received a new message from another user (no status field)
          // Format incoming message timestamp consistently
          const formattedMessage = {
            ...data,
            formatted_time: data.timestamp ? 
              new Date(data.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : undefined
          };
          
          if (onMessageReceived) onMessageReceived(formattedMessage);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected with code ${event.code}`);
      if (onDisconnected) onDisconnected();
      
      // Implement reconnection logic with exponential backoff
      clearTimeout(wsReconnectTimer);
      
      // Only reconnect on abnormal closures
      if (event.code !== 1000) {
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), MAX_RECONNECT_DELAY);
        reconnectAttempts++;
        
        console.log(`Will attempt to reconnect in ${delay}ms (attempt ${reconnectAttempts})`);
        wsReconnectTimer = setTimeout(() => {
          this.connectWebSocket(userId, onMessageReceived, onConnected, onDisconnected);
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    if (onDisconnected) onDisconnected();
    return null;
  }
}

  // Disconnect WebSocket
  disconnectWebSocket() {
    if (ws) {
      clearTimeout(wsReconnectTimer);
      ws.close();
      ws = null;
    }
  }
}

export default new MessageService();