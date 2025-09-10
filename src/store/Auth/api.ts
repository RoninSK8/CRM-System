import type {
  AuthData,
  Profile,
  RefreshToken,
  Token,
  UserRegistration,
} from '../../types/types';
import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    registerUser: create.mutation<Profile, UserRegistration>({
      query: ({ email, login, password, phoneNumber, username }) => ({
        url: 'auth/signup',
        method: 'POST',
        body: {
          email,
          login,
          password,
          phoneNumber,
          username,
        },
      }),
    }),
    loginUser: create.mutation<Token, AuthData>({
      query: ({ login, password }) => ({
        url: 'auth/signin',
        method: 'POST',
        body: {
          login,
          password,
        },
      }),
    }),
    updateTokens: create.mutation<Token, RefreshToken>({
      query: ({ refreshToken }) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: {
          refreshToken,
        },
      }),
    }),
  }),
  overrideExisting: true,
});
