import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { MobileDrawer } from "../../components/commons";
import { Box } from "@mui/system";
import { Navbar } from "../../components/commons";
import { useSelector } from "react-redux";
import Users from "./Users";
import Rooms from "./Rooms";
import Events from "./Events";
import Inbox from "./Inbox";
import Notifications from "./Notifications";

const Admin = () => {
  const userRole =  useSelector((state) => state.auth.role);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar with fixed width */}
      <Box sx={{ width: { sm: 240 }, flexShrink: 0, display: { xs: 'none', md: 'block' }}}>
        <MobileDrawer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} userRole={userRole} isPermanent={true} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1}}>
        {/* Fixed Navbar */}
        <Box sx={{ width: "100%"}}>
          <Navbar />
        </Box>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1}}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/events" element={<Events />} />
            <Route path="/inbox" element={<Inbox/>} />
            <Route path="/notifications" element={<Notifications/>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
