import React from "react";
import { Avatar, Box, Menu, MenuItem, Divider } from "@mui/material";
import { Person, Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
// import messageService from "../../redux/services/messageService";

const ProfileMenu = ({ user, anchorEl, handleMenuClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.role);


  const handleLogout = () => {
    // messageService.disconnectWebSocket();
    dispatch(logoutUser());
    // handleMenuClose();
    // navigate("/login");
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={() => navigate(`/${role}/profile/${userId}`)}>
        <Person sx={{ mr: 1 }} />
        View Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
