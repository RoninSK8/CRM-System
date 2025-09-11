import type { Profile } from '../../types/types';
import { baseApi } from '../baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getProfile: create.query<Profile, void>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProfileQuery } = userApi;
