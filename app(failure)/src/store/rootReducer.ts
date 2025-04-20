import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
