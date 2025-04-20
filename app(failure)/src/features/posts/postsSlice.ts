import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../types/Item';

export interface PostsState {
  items: Item[];
  notifications: Array<{
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  notifications: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePost: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    addNotification: (state, action: PayloadAction<{ message: string }>) => {
      state.notifications.push({
        id: Date.now().toString(),
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
  },
});

export const { updatePost, addNotification } = postsSlice.actions;
export default postsSlice.reducer;
