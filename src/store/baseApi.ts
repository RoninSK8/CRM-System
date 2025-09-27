import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { Token } from '../types/types';
import { tokenService } from '../services/tokenService';
import { setIsAuthorized } from './Auth/auth.slice';
import { clearUserProfile } from './User/user.slice';

const baseUrl = import.meta.env.VITE_DATABASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const accessToken = tokenService.getAccessToken()?.accessToken;
    console.log('Base query');

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
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
    const refreshToken = localStorage.getItem('refreshToken');
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
      tokenService.setAccessToken({ accessToken: tokenResponse.accessToken });
      localStorage.setItem('refreshToken', tokenResponse.refreshToken);

      store.dispatch(setIsAuthorized({ isAuthorized: true }));

      // Пробуем заново изначальный запрос
      result = await baseQuery(args, store, extraOptions);
    } else {
      console.log('logging out from reauth query');
      tokenService.clearAccessToken();
      localStorage.removeItem('refreshToken');
      store.dispatch(setIsAuthorized({ isAuthorized: false }));
      store.dispatch(clearUserProfile());
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
