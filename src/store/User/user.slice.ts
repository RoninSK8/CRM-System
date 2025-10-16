import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Profile, Role } from '../../types/types';
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
      state.userProfile = null;
    },
  },
});

export const selectUserProfile = (state: AppState) => state.user.userProfile;

export const selectUserRoles = (state: AppState) =>
  state.user.userProfile?.roles;

export const selectUserHasRequiredRole = createSelector(
  selectUserRoles,
  (userRoles) => (requiredRoles: Role[]) => {
    const isRequiredRole = userRoles?.some((role) =>
      requiredRoles.includes(role)
    );
    return isRequiredRole;
  }
);

export const { setProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
