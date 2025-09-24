import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

type AuthState = {
  isAuthorized: boolean;
  isLoading: boolean;
};

const initialState: AuthState = {
  isAuthorized: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthorized: (state, action) => {
      state.isAuthorized = action.payload.isAuthorized;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const selectIsAuthorized = (state: RootState) => state.auth.isAuthorized;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export const { setIsAuthorized, setIsLoading } = authSlice.actions;

export default authSlice.reducer;
