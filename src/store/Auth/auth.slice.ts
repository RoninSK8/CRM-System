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
      // перенесено в baseApiWithAuth и в компонент логина чтобы не было сайд эффектов
      // localStorage.setItem('userRefreshToken', action.payload.userRefreshToken);
      state.userAccessToken = action.payload.userAccessToken;
      state.userRefreshToken = action.payload.userRefreshToken;
    },
    deleteAuthTokensFromState: (state) => {
      // перенесено в baseApiWithAuth чтобы не было сайд эффектов
      // localStorage.removeItem('userRefreshToken');
      state.userAccessToken = null;
      state.userRefreshToken = null;
    },
  },
});

export const selectAccessToken = (state: RootState) =>
  state.auth.userAccessToken;
export const selectRefreshToken = (state: RootState) =>
  state.auth.userRefreshToken;

export const { authTokenChange, deleteAuthTokensFromState } = authSlice.actions;

export default authSlice.reducer;
