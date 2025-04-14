import React, { useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { Box } from "@mui/system";
import { Navbar, MobileDrawer } from "../../components/navigations";
import { useSelector } from "react-redux";
import Users from "./users/Users";
import Rooms from "./Rooms";
import Events from "./Events";
import Inbox from "./Inbox";
import Notifications from "./Notifications";
import ResidenceHall from "./ResidenceHall";
import AddNewUsers from "./users/AddNewUsers";

const Admin = () => {
  const userRole = useSelector((state) => state.auth.role);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar with fixed width */}
      <Box
        sx={{
          width: { sm: 240 },
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <MobileDrawer
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          userRole={userRole}
          isPermanent={true}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Fixed Navbar */}
        <Box sx={{ width: "100%" }}>
          <Navbar />
        </Box>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/admin_dashboard" element={<AdminDashboard />} />
            <Route path="/admin_users" element={<Users />} />
            <Route path="/admin_users/add_user" element={<AddNewUsers />} />
            <Route path="/admin_rooms" element={<Rooms />} />
            <Route path="/admin_residence_halls" element={<ResidenceHall />} />
            <Route path="/admin_events" element={<Events />} />
            <Route path="/admin_inbox" element={<Inbox />} />
            <Route path="/admin_notifications" element={<Notifications />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
