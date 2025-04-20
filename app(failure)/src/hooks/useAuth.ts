import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { loginSuccess, loginFailure, logout } from '../features/auth/authSlice';
import type { RootState } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.initialize();
        if (token) {
          const decoded = authService.getDecodedToken();
          if (decoded) {
            dispatch(loginSuccess({ user: decoded, token }));
          }
        }
      } catch (error) {
        dispatch(loginFailure(error));
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { user, token } = await authService.login(credentials);
      dispatch(loginSuccess({ user, token }));
      navigate('/');
      return true;
    } catch (error) {
      dispatch(loginFailure(error));
      return false;
    }
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    try {
      const { user, token } = await authService.register(data);
      dispatch(loginSuccess({ user, token }));
      navigate('/');
      return true;
    } catch (error) {
      dispatch(loginFailure(error));
      return false;
    }
  };

  const handleLogout = () => {
    authService.clearTokens();
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    isAdmin: authService.isAdmin(),
    loading,
    error,
    login,
    register,
    logout: handleLogout
  };
};