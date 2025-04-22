import React from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";

const MessageBubble = ({ message }) => {
  const { content, isMine, sender } = message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMine ? "row-reverse" : "row",
        mb: 2,
        alignItems: "flex-end"
      }}
    >
      {!isMine && (
        <Avatar
          src={sender.avatar}
          alt="User"
          sx={{ width: 32, height: 32, mr: 1 }}
        />
      )}

      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 2,
          maxWidth: '75%',
          bgcolor: isMine ? '#4a7fff' : 'white',
          color: isMine ? 'white' : 'text.primary',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="body1">{content}</Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;