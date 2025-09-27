import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Profile } from '../../types/types';
import type { AppState } from '../redux';

type UserState = {
  userProfile: Profile | null;
};

const initialState: UserState = {
  userProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.userProfile = action.payload;
    },
    clearUserProfile: (state) => {
      console.log('clearing user profile from user slice reducer');
      state.userProfile = null;
    },
  },
});

export const selectUserProfile = (state: AppState) => state.user.userProfile;

export const { setProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
