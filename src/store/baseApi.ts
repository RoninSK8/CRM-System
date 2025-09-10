import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { authTokenChange, logoutUser } from './Auth/auth.slice';
import type { Token } from '../types/types';

const baseUrl = import.meta.env.VITE_DATABASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userAccessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    const authState = (store.getState() as RootState).auth;
    if (!authState.userAccessToken || !authState.userRefreshToken)
      return result;

    console.log('before refresh call');

    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
        body: { refreshToken: authState.userRefreshToken },
      },
      store,
      extraOptions
    );
    console.log('after refresh call', refreshResult.data);

    if (refreshResult.data) {
      const tokenResponse = refreshResult.data as Token;
      store.dispatch(
        authTokenChange({
          userAccessToken: tokenResponse.accessToken,
          userRefreshToken: tokenResponse.refreshToken,
        })
      );
      localStorage.setItem('userRefreshToken', tokenResponse.refreshToken);
      // Retry the original request
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(logoutUser());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Todo'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
