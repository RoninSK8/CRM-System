import { createSlice } from '@reduxjs/toolkit';

import type { Profile } from '../../types/types';
import type { AppState } from '../redux';

type UserState = {
  userProfile: Profile | null;
};

const initialState: UserState = {
  userProfile: null,
};

const userSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.userProfile = action.payload.userProfile;
    },
  },
});

export const selectUserProfile = (state: AppState) => state.user.userProfile;

export const { setProfile } = userSlice.actions;

export default userSlice.reducer;
