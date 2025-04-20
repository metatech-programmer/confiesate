import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
  isAnonymous?: boolean;
  notificationPreferences: {
    comments: boolean;
    likes: boolean;
    mentions: boolean;
    moderation?: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateNotificationPreferences: (state, action: PayloadAction<User['notificationPreferences']>) => {
      if (state.user) {
        state.user.notificationPreferences = action.payload;
      }
    }
  },
});

export const { 
  loginSuccess, 
  loginFailure, 
  logout, 
  refreshTokenSuccess,
  updateUser,
  updateNotificationPreferences
} = authSlice.actions;

export default authSlice.reducer;