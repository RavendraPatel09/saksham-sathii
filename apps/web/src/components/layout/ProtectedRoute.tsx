import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'candidate' | 'employer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { workspaceMode } = useAppContext();
  const location = useLocation();

  if (workspaceMode !== allowedRole) {
    // If not logged in as the correct role, redirect to their dashboard or home
    if (workspaceMode === 'candidate') {
      return <Navigate to="/dashboard" replace />;
    } else if (workspaceMode === 'employer') {
      return <Navigate to="/employer" replace />;
    } else {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
