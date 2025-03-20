import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  ListItemButton,
  ListItem,
  Divider,
  ListItemText,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import SearchBar from "../layouts/SearchBar";
import NavLinks from "../layouts/NavLinks";
import ProfileMenu from "../layouts/ProfileMenu";
import MobileDrawer from "./MobileDrawer";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Logo from "../../assets/logo.svg";
import { getRightSideMenuItems } from "../../utils/menuUtils";

const CustomNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const userRole =  useSelector((state) => state.auth.role);
  const user = { name: "John", photoUrl: "https://via.placeholder.com/40" }; //dummy 

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          {/* Left Section: Logo & Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {userRole !== "admin" && (
              <Box sx={{ cursor: "pointer", marginRight: 2 }}>
                <img
                  src={Logo}
                  alt="Logo"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </Box>
            )}

            {userRole !== "admin" && <NavLinks userRole={userRole} />}
          </Box>

          {/* Search Bar  for admin and users*/}
          {userRole && <SearchBar placeHolder = "Search.."/>}

          {/* Right Section: Profile & Menu for admins and user, login and signup for not login/signup users */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {userRole && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    padding: "4px 4px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  onClick={handleProfileMenuOpen}
                >
                  <Avatar src={user.photoUrl} sx={{ width: 40, height: 40 }} />
                  <ArrowDropDown sx={{ color: "black", fontSize: "10px, " }} />
                </Box>

                {/*  ProfileMenu upon clicking avatar */}
                <ProfileMenu 
                  user={user} 
                  anchorEl={anchorEl} 
                  handleMenuClose={handleMenuClose} 
                />
              </>)
            }

            {/* Show login/signup only for non-logged in users */}
            {!userRole && 
              <>
                <Divider sx={{ my: 1 }} />
                {getRightSideMenuItems.map((item) => (
                  <Box
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                      console.log(item.path)
                    }}
                    sx={{
                      backgroundColor: location.pathname === item.path ? "#1976d2" : "transparent",
                      color: location.pathname === item.path ? "#ffffff" : "black",
                      fontWeight: location.pathname === item.path ? "bold" : "normal",
                      borderRadius: "8px",
                      margin: "4px 8px",
                      padding: "10px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: location.pathname === item.path ? "#1565c0" : "#f5f5f5",
                      },
                    }}
                  >
                    {item.label}
                  </Box>

                ))}
              </>
            }

            {/* Mobile hamburger Menu Button, it toggle the drawer with menus options */}
            <IconButton
              edge="end"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer with menu options*/}
      <MobileDrawer
        open={mobileOpen}
        toggleDrawer={toggleDrawer}
        userRole={userRole}
      />
    </>
  );
};

export default CustomNavbar;
