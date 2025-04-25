
import { Navbar } from "./components/navigations";
import { LandingPage, Login, Admin, User, NotFound } from "./pages";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { AdminRoute, UserRoute } from "./utils/protectedRoutes"

function App() {
  const { role, access_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is logged in and tries to access public routes, redirect to dashboard
    if (access_token && ["/", "/login"].includes(location.pathname)) {
      if (role === "admin") {
        navigate("/admin/admin_dashboard");
      } else {
        navigate("/user/user_home");
      }
    }
    // Handle unauthenticated access to protected routes
    else if (!access_token && !["/", "/login", "/about-us", "/contact"].includes(location.pathname)) {
      navigate("/login");
    }
    // Handle role-based redirects
    else if (access_token) {
      if (location.pathname.startsWith("/admin") && role !== "admin") {
        navigate("/user/user_home");
      } else if (location.pathname.startsWith("/user") && role === "admin") {
        navigate("/admin/admin_dashboard");
      }
    }
  }, [access_token, role, location.pathname, navigate]);

  return (
    <>
      {role !== "admin" && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />


        <Route element={<UserRoute />}>
          <Route path="/user/*" element={<User />} />
        </Route>
        

        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
        
        {/* Error routes */}
        <Route path="notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;