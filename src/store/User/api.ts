import type { Profile } from '../../types/types';
import { baseApi } from '../baseApi';
import { setProfile } from './user.slice';

export const userApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getProfile: create.query<Profile, void | null>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        console.log('logging from getProfile endpoint', data);
        dispatch(setProfile(data));
      },
      providesTags: ['UserProfile'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProfileQuery } = userApi;
