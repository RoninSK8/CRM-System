import type { Profile, UserRegistration } from '../../types/types';
import { baseApi } from '../baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getProfile: create.query<Profile, UserRegistration>({
      query: () => ({
        url: 'user/profile',
        method: 'GetParamsFromSelectors',
      }),
    }),
  }),
  overrideExisting: true,
});
