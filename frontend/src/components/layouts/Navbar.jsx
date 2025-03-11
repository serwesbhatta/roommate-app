import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg"
import { 
  AppBar, Toolbar, Button, IconButton, Box, Drawer, List, ListItem, 
  ListItemButton, ListItemText,Avatar,Typography,Menu,MenuItem,Divider
} from "@mui/material";
import { Settings, Logout, Menu as MenuIcon, ArrowDropDown, Person, ModeEdit} from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../redux/slices/authSlice";

const CustomNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // const userRole = useSelector((state) => state.auth.role);  // for now commenting...
  // const user = useSelector((state) => state.auth.user);  // Add this to get user data

  // For demo purposes - replace with actual user data from Redux
  const userRole = "user";  
  const user = {
    name: "John Doe",
    photoUrl: "https://via.placeholder.com/40" // Replace with actual photo URL from your state
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuEvent = (navigateTo) => {
    handleMenuClose();
    userRole === "user"? navigate(`/user/${navigateTo}`):  navigate(`/admin/${navigateTo}`)
  }

  // Define menu items
  const leftMenuItems = userRole
    ? userRole === "user"
      ? [
          { label: "Home", path: "/user" }, 
          { label: "Find Roommate", path: "user/roommate" },
          { label: "Events", path: "user/events" },
          { label: "Notifications", path: "user/notifications" },
          { label: "Messages", path: "user/message" },
        ]
      : [
          { label: "Home", path: "/admin" }, 
          { label: "Events", path: "admin/events" }, 
          { label: "Notifications", path: "admin/notifications" }
        ]
    : [
        { label: "Home", path: "/" }, 
        { label: "About Us", path: "/aboutus" }, 
        { label: "Contact", path: "/contact" }
      ];

  const rightMenuItems = !userRole
    ? [{ label: "Login", path: "/login" }, { label: "Sign Up", path: "/signup" }]
    : [];

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
          {/* Left Side: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ cursor: "pointer", marginRight: 2}}
              onClick={
                () => userRole
                ? userRole === "user"
                  ? navigate("/user")
                  : navigate("/admin")
                : navigate("/")
              }
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

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {leftMenuItems.map((item) => (
                <Button 
                  key={item.label} 
                  sx={{
                    color: location.pathname === item.path ? "white" : "black", 
                    backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                    transition: "0.3s",
                    borderRadius: "8px",
                    "&:hover": {
                      color:'black',
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

          {/* Right Side: User Profile or Login/Signup */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {userRole ? (
              <>
                {/* User Photo and Profile Dropdown */}
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1, 
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    }
                  }}
                  onClick={handleProfileMenuOpen}
                >
                  <Avatar 
                    src={user.photoUrl} 
                    alt={user.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: "black",
                      display: { xs: "none", sm: "block" } // Hide text on extra small screens
                    }}
                  >
                    {user.name}
                  </Typography>
                  <ArrowDropDown sx={{ color: "black" }} />
                </Box>
                
                {/* Profile Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      minWidth: "200px",
                      borderRadius: "8px",
                      mt: 1.5,
                    }
                  }}
                >
                  <MenuItem onClick={()=> handleMenuEvent("profile")}>
                    <Person sx={{ mr: 1 }} />
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={()=> handleMenuEvent("settings")}>
                    <Settings sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  <MenuItem 
                    onClick={()=> handleMenuEvent("edit-profile")}>
                    <ModeEdit sx={{ mr: 1 }} />
                    Edit Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Show login/signup buttons on desktop, hide on mobile
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {rightMenuItems.map((item) => (
                  <Button 
                    key={item.label} 
                    sx={{
                      color: location.pathname === item.path ? "white" : "black", 
                      backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                      transition: "0.3s",
                      borderRadius: "8px",
                      "&:hover": {
                        color:'black',
                        backgroundColor: "#f5f5f5", 
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", 
                      },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Menu Icon - Always show on mobile regardless of login status */}
            <IconButton 
              edge="end" 
              sx={{ 
                color: "black",
                display: { xs: "flex", md: "none" }  // Show on mobile (xs, sm), hide on desktop (md+)
              }} 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <List sx={{ width: 250 }}>
          {/* Always show navigation links */}
          {leftMenuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                onClick={() => { 
                  navigate(item.path); 
                  setMobileOpen(false); 
                }}
                sx={{
                  backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                  color: location.pathname === item.path ? "#ffffff" : "black",
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                  borderRadius: "8px",
                  margin: "4px 8px",
                  "&:hover": {
                    backgroundColor: location.pathname === item.path ? "#1565c0" : "#f5f5f5",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          
          {/* Show login/signup only for non-logged in users */}
          {!userRole && (
            <>
              <Divider sx={{ my: 1 }} />
              {rightMenuItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton 
                    onClick={() => { 
                      navigate(item.path); 
                      setMobileOpen(false); 
                    }}
                    sx={{
                      backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                      color: location.pathname === item.path ? "#ffffff" : "black",
                      fontWeight: location.pathname === item.path ? "bold" : "normal",
                      borderRadius: "8px",
                      margin: "4px 8px",
                      "&:hover": {
                        backgroundColor: location.pathname === item.path ? "#1565c0" : "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default CustomNavbar;