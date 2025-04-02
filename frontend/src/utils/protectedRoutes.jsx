
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute: Requires authentication to access
export const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes
  return <Outlet />;
};

// AdminRoute: Only accessible to admin users
export const AdminRoute = () => {
  const { token, role } = useSelector((state) => state.auth);
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'admin') {
    // Redirect to user dashboard if authenticated but not admin
    return <Navigate to="/user" replace />;
  }
  
  // Render child routes for admin
  return <Outlet />;
};

// UserRoute: Only accessible to regular users
export const UserRoute = () => {
  const { token, role } = useSelector((state) => state.auth);
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (role === 'admin') {
    // Redirect to admin dashboard if user is admin
    return <Navigate to="/admin" replace />;
  }
  
  // Render child routes for regular users
  return <Outlet />;
};