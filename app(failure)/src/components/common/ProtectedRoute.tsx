import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Role, hasRole } from '../../utils/roles';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requireAnonymous?: boolean;
  allowAnonymous?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = Role.USER,
  requireAnonymous = false,
  allowAnonymous = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isAnonymousUser, refreshToken } = useAuth();
  const location = useLocation();

  // Verify session validity
  useEffect(() => {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (sessionExpiry && Date.now() >= parseInt(sessionExpiry)) {
      refreshToken();
    }
  }, [refreshToken]);

  // Check authentication
  if (!isAuthenticated) {
    toast.error('Debes iniciar sesión para acceder a esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Handle anonymous user requirements
  if (requireAnonymous && !isAnonymousUser()) {
    toast.error('Esta página es solo para usuarios anónimos');
    return <Navigate to="/" replace />;
  }

  if (!allowAnonymous && isAnonymousUser()) {
    toast.error('Necesitas una cuenta regular para acceder a esta página');
    return <Navigate to="/auth/upgrade" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(user?.role || Role.USER, requiredRole)) {
    toast.error('No tienes permisos para acceder a esta página');
    return <Navigate to="/" replace />;
  }

  // Check session expiry
  const sessionExpiry = user?.sessionExpiry;
  if (sessionExpiry && Date.now() >= sessionExpiry) {
    toast.error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};