import React, { useState } from "react";
import { Card, Typography, TextField, Button, Link, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice"; // Removed resetStatus from import
import Roomate from "../../assets/roommates.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);

  // State for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Local state to track submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
  
    // Simple validation
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@my\.msutexas\.edu$/.test(email)) {
      setEmailError("Enter a valid MSU email");
      valid = false;
    }
    
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }
  
    if (!valid) return;
  
    setIsSubmitting(true);
  
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap(); 
      const role = res.role || (res.user && res.user.role);
      
      if (role) {
        
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
        
        // Reset submission state and navigate
        setIsSubmitting(false);
        navigate(role === 'admin' ? '/admin/admin_dashboard' : '/user/user_home');
      } else {
        console.error("No role found in response:", res);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        padding: "0 90px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "60%",
          borderRadius: "12px",
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            height: "100%",
            borderRadius: "12px 0 0 12px",
            overflow: "hidden",
          }}
        >
          <img
            src={Roomate}
            alt="Sign In"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>

        {/* Right Side - Sign In Form */}
        <Card
          sx={{
            padding: 4,
            borderRadius: "0 12px 12px 0",
            flex: 1,
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#FF9800",
                fontWeight: "bold",
                textAlign: "center",
                mb: 2,
              }}
            >
              Login
            </Typography>

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: "left" }}>
                {error}
              </Typography>
            )}

            <TextField
              fullWidth
              label="MSU Email"
              variant="outlined"
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#1976D2", color: "#FFF", mb: 2 }}
              onClick={handleSubmit}
              disabled={isSubmitting || status === "loading"}
            >
              {isSubmitting || status === "loading" ? "Signing In..." : "Login"}
            </Button>

            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                display: "block",
                mt: 2,
                color: "#999",
              }}
            >
              By clicking on Sign up, you agree to our{" "}
              <Link href="#">Terms of service</Link> and{" "}
              <Link href="#">Privacy policy</Link>.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;