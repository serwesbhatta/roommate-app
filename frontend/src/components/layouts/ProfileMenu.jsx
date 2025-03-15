import React from "react";
import { Avatar, Box, Menu, MenuItem, Divider } from "@mui/material";
import { Person, Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const ProfileMenu = ({ user, anchorEl, handleMenuClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handleMenuClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={() => navigate("/profile")}>
        <Person sx={{ mr: 1 }} />
        View Profile
      </MenuItem>
      <MenuItem onClick={() => navigate("/settings")}>
        <Settings sx={{ mr: 1 }} />
        Settings
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
