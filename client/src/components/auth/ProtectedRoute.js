import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user's role
    if (user.role === 'worker') {
      return <Navigate to="/worker" replace />;
    } else if (user.role === 'employer') {
      return <Navigate to="/employer" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Fallback to home page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role
  return children;
};

export default ProtectedRoute;

