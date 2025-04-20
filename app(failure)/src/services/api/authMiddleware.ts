import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { refreshToken, logout } from '../../features/auth/authSlice';
import { api } from './api';

export const authMiddleware: Middleware<{}, RootState> = store => next => action => {
  // Manejo del refresh token cuando está próximo a expirar
  if (action.type === 'auth/checkSession') {
    const state = store.getState();
    const { sessionExpiry } = state.auth;
    
    if (sessionExpiry) {
      const timeToExpiry = sessionExpiry - Date.now();
      const refreshThreshold = 5 * 60 * 1000; // 5 minutos

      if (timeToExpiry <= refreshThreshold) {
        store.dispatch(refreshToken())
          .unwrap()
          .catch(() => {
            store.dispatch(logout());
          });
      }
    }
  }

  return next(action);
};
