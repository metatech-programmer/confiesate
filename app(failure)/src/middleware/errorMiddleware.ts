import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { logError } from '../utils/errorTracking';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload;
    const message = error.data?.message || 'Ha ocurrido un error';
    
    // Mostrar notificación de error
    toast.error(message);
    
    // Registrar error en el sistema de tracking
    logError(error, {
      action: action.type,
      path: window.location.pathname,
    });
  }

  return next(action);
};
