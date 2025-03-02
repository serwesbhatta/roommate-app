import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg"
import { AppBar, Toolbar, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const CustomNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userType, setUserType] = useState(null); // "user", "admin", or null
  const navigate = useNavigate();

  // Check login status on page load
  useEffect(() => {
    const logInUser = localStorage.getItem("LogInUserName");
    const logInAdmin = localStorage.getItem("LogInAdminName");

    if (logInUser) setUserType("user");
    else if (logInAdmin) setUserType("admin");
    else setUserType(null);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("LogInUserName");
    localStorage.removeItem("LogInAdminName");
    setUserType(null);
    navigate("/login");
  };

  // Define menu items
  const leftMenuItems = userType
    ? userType === "user"
      ? [{ label: "Home", path: "/" }, { label: "User Dashboard", path: "/userDashboard" }]
      : [{ label: "Home", path: "/" }, { label: "Admin Dashboard", path: "/adminDashboard" }]
    : [{ label: "Home", path: "/" }, { label: "About Us", path: "/" }, { label: "Contact", path: "/" }];

  const rightMenuItems = userType
    ? [{ label: "Logout", path: "/login", action: handleLogout }]
    : [{ label: "Login", path: "/login" }, { label: "Sign Up", path: "/signup" }];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side: Logo + Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ cursor: "pointer", marginRight: 2}}
              onClick={() => navigate("/")}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "50px",  
                  height: "50px", 
                  borderRadius: "50%",
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5", 
                }}

              />
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {leftMenuItems.map((item) => (
                <Button 
                  key={item.label} 
                  sx={{
                    color: "black",
                    transition: "0.3s",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5", 
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", 
                    },
                  }}
                  onClick={() => navigate(item.path)}>
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right Side: Login, Sign Up, or Logout */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2}}>
            {rightMenuItems.map((item) => (
              <Button 
                key={item.label} 
                sx={{
                  color: "black",
                  transition: "0.3s",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#f5f5f5", 
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", 
                  },
                }}
                onClick={() => (item.action ? item.action() : navigate(item.path))}

              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton edge="end" sx={{ display: { md: "none" }, color: "black" }} onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <List sx={{ width: 200 }}>
          {[...leftMenuItems, ...rightMenuItems].map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => { item.action ? item.action() : navigate(item.path); setMobileOpen(false); }}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default CustomNavbar;
