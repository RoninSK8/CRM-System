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

  // ошибка приходит в таком формате, чего не ожидаает обработчик, поэтому проверяю на наличие 'originalStatus' чтобы не ругался ts
  // {
  //   "error": {
  //       "status": "PARSING_ERROR",
  //       "originalStatus": 409,
  //       "data": "user already exists\n",
  //       "error": "SyntaxError: Unexpected token 'u', \"user already exists\n\" is not valid JSON"
  //   },
  //   "meta": {
  //       "request": {},
  //       "response": {}
  //   }
  // }

  if (
    result.error &&
    'originalStatus' in result.error &&
    result.error.originalStatus === 401
  ) {
    const refreshToken = localStorage.getItem('userRefreshToken');
    if (!refreshToken) {
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken: refreshToken },
      },
      store,
      extraOptions
    );

    if (refreshResult.data) {
      const tokenResponse = refreshResult.data as Token;
      store.dispatch(
        authTokenChange({
          userAccessToken: tokenResponse.accessToken,
          userRefreshToken: tokenResponse.refreshToken,
        })
      );
      localStorage.setItem('userRefreshToken', tokenResponse.refreshToken);
      // Пробуем заново изначальный запрос
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(logoutUser());
      localStorage.removeItem('userRefreshToken');
      window.location.href = '/auth/login';
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Todo', 'UserProfile'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
