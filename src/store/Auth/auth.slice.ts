import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

type AuthState = {
  userAccessToken: string | null;
  userRefreshToken: string | null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userAccessToken: null,
    userRefreshToken: localStorage.getItem('refreshToken'),
  } as AuthState,
  reducers: {
    authTokenChange: (
      state,
      action: PayloadAction<{
        userAccessToken: string;
        userRefreshToken: string;
      }>
    ) => {
      // TODO убрать сайдэффекты в виде изменения localStorage из редьюсеров
      localStorage.setItem('userRefreshToken', action.payload.userRefreshToken);
      state.userAccessToken = action.payload.userAccessToken;
      state.userRefreshToken = action.payload.userRefreshToken;
    },
    logoutUser: (state) => {
      console.log('logout reducer activated');
      localStorage.removeItem('userRefreshToken');
      state.userAccessToken = null;
      state.userRefreshToken = null;
    },
  },
});

export const selectAccessToken = (state: RootState) =>
  state.auth.userAccessToken;
export const selectRefreshToken = (state: RootState) =>
  state.auth.userRefreshToken;

export const { authTokenChange, logoutUser } = authSlice.actions;

export default authSlice.reducer;
