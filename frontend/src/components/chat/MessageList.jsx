import React, { useRef, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";
import UserActivityStatus from "./UserActivityStatus";

const MessageList = ({ messages, loading, currentUser, lastSeen, online }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* User activity status at the top */}
      {currentUser && (
        <UserActivityStatus 
          user={currentUser} 
          online={online} 
          lastSeen={lastSeen} 
        />
      )}
      
      {/* Messages content */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%' 
        }}>
          <CircularProgress />
        </Box>
      ) : messages.length > 0 ? (
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Display messages without date grouping */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={endRef} />
        </Box>
      ) : (
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Typography color="text.secondary">
            No messages yet. Start a conversation!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;