import React from "react";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuItems } from "../../utils/menuUtils";

const NavLinks = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = getMenuItems(userRole);

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
      {menuItems.map((item) => (
        <Box
          key={item.label}
          sx={{
            color: location.pathname === item.path ? "white" : "black",
            backgroundColor:
              location.pathname === item.path ? "#1976d2" : "transparent",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5", color: "black" },
          }}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );
};

export default NavLinks;
