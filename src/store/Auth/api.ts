import { tokenService } from '../../services/tokenService';
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
    logoutUser: create.mutation<void, void>({
      query: () => ({
        url: 'user/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          tokenService.clearAccessToken();
          localStorage.removeItem('refreshToken');
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useLogoutUserMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateTokensMutation,
} = authApi;
