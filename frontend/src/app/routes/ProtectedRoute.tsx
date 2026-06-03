import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render nested child routes
  return <Outlet />;
};
export default ProtectedRoute;
