import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuItems } from "../../utils/menuUtils";
import logo from "../../assets/logo.svg";



const MobileDrawer = ({ open, toggleDrawer, userRole, isPermanent = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const menuItems = getMenuItems(userRole);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo and Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* <img
          src={Logo}
          alt="Roomie Logo"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "contain",
            backgroundColor: "#f5f5f5",
          }}
          
        /> */}
        <Box sx={{ cursor: "pointer", marginRight: 2 }}>
            <img src={logo} alt="Logo" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
        </Box>
        <Box sx={{ ml: 2, fontWeight: "bold", fontSize: "1.25rem" }}>Roomie</Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) toggleDrawer();
              }}
              sx={{
                backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                color: location.pathname === item.path ? "white" : "inherit",
                borderRadius: "8px",
                margin: "4px 8px",
                "&:hover": {
                  backgroundColor: location.pathname === item.path ? "#1565c0" : "#f5f5f5",
                },
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: location.pathname === item.path ? "white" : "inherit", minWidth: "40px" }}>
                  <item.icon />
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      anchor="left"
      open={isPermanent || open}
      onClose={toggleDrawer}
      sx={{
        display: isPermanent ? { xs: "none", md: "block" } : { xs: "block", md: "none" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default MobileDrawer;
