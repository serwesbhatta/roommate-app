import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
  Box
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { formatLastSeen } from "../../utils/formatters";

const ConversationItem = ({ conversation, onSelect }) => {
  const {
    user,
    lastMessage,
    unread,
    isGroup,
    online,
    lastSeen
  } = conversation;

  return (
    <ListItem
      button
      onClick={() => onSelect(conversation)}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": { bgcolor: "action.hover" }
      }}
    >
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <FiberManualRecordIcon
              sx={{
                color: online ? "success.main" : "text.disabled",
                fontSize: 12,
                backgroundColor: "#fff",
                borderRadius: "50%"
              }}
            />
          }
        >
          <Avatar src={user.avatar} alt={user.name}>
            {user.name.charAt(0)}
          </Avatar>
        </Badge>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography
            component="span"
            variant="subtitle1"
            noWrap
            sx={{ maxWidth: "100%" }}
          >
            {user.name}
          </Typography>
        }
        secondary={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {/* Last message */}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: "100%" }}
            >
              {lastMessage || "Start chatting"}
            </Typography>

            {/* Status + unread badge */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {!isGroup && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {online ? "Online" : formatLastSeen(lastSeen)}
                </Typography>
              )}

              {unread > 0 && <Badge badgeContent={unread} color="primary" />}
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

export default ConversationItem;
