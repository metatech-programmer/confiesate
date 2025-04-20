import { Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';
import { RootState } from '../store';

export const authMiddleware: Middleware<{}, RootState> = store => next => action => {
  if (action.type?.endsWith('/rejected')) {
    const error = action.payload;
    if (error?.status === 401) {
      store.dispatch(logout());
      toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      return;
    }
  }
  return next(action);
};
