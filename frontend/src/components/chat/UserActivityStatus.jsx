import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthUserById } from "../../redux/slices/authSlice";
import { formatLastSeen } from "../../utils/formatters";

const UserActivityStatus = ({ userId, lastSeen, online }) => {

  return (
    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: online ? "#44b700" : "#bdbdbd", mr: 1 }} />
      <Typography variant="caption" color={online ? "success.main" : "text.secondary"}>{online ? "Online now" : formatLastSeen(lastSeen)}</Typography>
    </Box>
  );
};
export default UserActivityStatus;