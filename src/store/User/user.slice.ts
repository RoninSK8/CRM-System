import { createAction, createReducer } from '@reduxjs/toolkit';

import type { Profile } from '../../types/types';
import type { AppState } from '../redux';

type UserState = {
  userProfile: Profile | null;
};

const initialUserState: UserState = {
  userProfile: null,
};

export const setProfile = createAction<{
  userProfile: Profile | null;
}>('user/setUserProfile');

export const userReducer = createReducer(initialUserState, (builder) => {
  builder.addCase(setProfile, (state, action) => {
    state.userProfile = action.payload.userProfile;
  });
});

export const selectUserProfile = (state: AppState) => state.user.userProfile;
