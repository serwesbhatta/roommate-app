import React from "react";
import { Paper, Box, Avatar, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { formatLastSeen } from "../../utils/formatters";

const ChatHeader = ({ conversation, onBack }) => {
  const { user, isGroup, online, lastSeen } = conversation;
  console.log("chatHeader conversation",conversation)
  return (
    <Paper elevation={0} sx={{ p: 1.5, display: "flex", alignItems: "center", bgcolor: "white", borderBottom: "1px solid #efefef" }}>
      {onBack && <IconButton onClick={onBack} sx={{ color: "#4a7fff" }}><ArrowBack /></IconButton>}
      <Avatar src={user.avatar} sx={{ ml: onBack ? 1 : 0, width: 38, height: 38, border: online ? "2px solid #44b700" : "none" }} />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" fontWeight={500}>{user.name}</Typography>
        <Typography variant="caption" color="text.secondary">{isGroup ? "Group Chat" : online ? "Online" : formatLastSeen(lastSeen)}</Typography>
      </Box>
    </Paper>
  );
};
export default ChatHeader;