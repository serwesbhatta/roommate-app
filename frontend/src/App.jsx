
import { Navbar } from "./components/navigations";
import { LandingPage, Login, Admin, User, NotFound, AboutUs, Contact } from "./pages";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { ProtectedRoute, AdminRoute, UserRoute } from "./utils/protectedRoutes"

function App() {
  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is logged in and tries to access public routes, redirect to dashboard
    if (token && ["/", "/login"].includes(location.pathname)) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
    // Handle unauthenticated access to protected routes
    else if (!token && !["/", "/login", "/about-us", "/contact"].includes(location.pathname)) {
      navigate("/login");
    }
    // Handle role-based redirects
    else if (token) {
      if (location.pathname.startsWith("/admin") && role !== "admin") {
        navigate("/user");
      } else if (location.pathname.startsWith("/user") && role === "admin") {
        navigate("/admin");
      }
    }
  }, [token, role, location.pathname, navigate]);

  return (
    <>
      {role !== "admin" && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Protected user routes */}
        <Route element={<UserRoute />}>
          <Route path="/user/*" element={<User />} />
        </Route>
        
        {/* Protected admin routes */}
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