import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Debes iniciar sesión para acceder a esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    toast.error('No tienes permisos para acceder a esta página');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
