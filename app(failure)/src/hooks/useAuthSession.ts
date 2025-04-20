import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { refreshSession } from '../features/auth/authSlice';

const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes de expirar

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const { sessionExpiry, isAuthenticated, lastRefresh } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    const checkSession = () => {
      const now = Date.now();
      const timeUntilExpiry = sessionExpiry - now;

      if (timeUntilExpiry <= REFRESH_THRESHOLD && (!lastRefresh || now - lastRefresh > REFRESH_THRESHOLD)) {
        dispatch(refreshSession());
      }
    };

    const interval = setInterval(checkSession, 60000); // Verificar cada minuto
    checkSession(); // Verificar inmediatamente

    return () => clearInterval(interval);
  }, [dispatch, sessionExpiry, isAuthenticated, lastRefresh]);
};
