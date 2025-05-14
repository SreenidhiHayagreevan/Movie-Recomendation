import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Extended user interface to include isAdmin property
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  username?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Check for client-side admin authentication if not authenticated through context
  const checkClientAdminAuth = () => {
    if (!isAuthenticated) {
      // Check localStorage directly for admin user
      const storedUserString = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUserString && storedToken) {
        try {
          const storedUser = JSON.parse(storedUserString);
          if (storedUser.isAdmin && storedToken === 'admin-token') {
            // Client-side admin is authenticated
            return true;
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      return false;
    }
    return isAuthenticated;
  };
  
  const isAdminAuthenticated = checkClientAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // First check for client-side admin authentication
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated through context, check if user is admin
  const userAsExtended = user as ExtendedUser | null;
  if (isAuthenticated && userAsExtended && !userAsExtended.isAdmin) {
    // Get user from localStorage as a fallback
    const storedUserString = localStorage.getItem('user');
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString) as ExtendedUser;
        if (!storedUser.isAdmin) {
          return <Navigate to="/movies" replace />;
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return <Navigate to="/movies" replace />;
      }
    } else {
      return <Navigate to="/movies" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
