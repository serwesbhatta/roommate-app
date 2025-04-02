import React from "react";
import { Avatar, Box, Menu, MenuItem, Divider } from "@mui/material";
import { Person, Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const ProfileMenu = ({ user, anchorEl, handleMenuClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.role);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handleMenuClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={() => navigate(`/${role}/profile/${userId}`)}>
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
