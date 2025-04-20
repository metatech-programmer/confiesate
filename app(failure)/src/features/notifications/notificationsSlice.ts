import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

interface NotificationsState {
  items: Notification[];
  preferences: {
    enabled: boolean;
    pushEnabled: boolean;
  };
}

const initialState: NotificationsState = {
  items: [],
  preferences: {
    enabled: true,
    pushEnabled: false,
  },
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'timestamp'>>) => {
      state.items.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    updateNotificationPreferences: (state, action: PayloadAction<Partial<NotificationsState['preferences']>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
  },
});

export const { addNotification, updateNotificationPreferences } = notificationsSlice.actions;

export default notificationsSlice.reducer;
