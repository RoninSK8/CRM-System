import type {
  GetUsersMetaResponse,
  User,
  UserFilters,
  UserRequest,
} from '../../types/types';
import { baseApi } from '../baseApi';

type UpdateUserArgs = {
  data: UserRequest;
  id: number;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getUsers: create.query<GetUsersMetaResponse<User>, UserFilters>({
      query: ({ search, sortBy, sortOrder, isBlocked, limit, page }) => ({
        url: 'admin/users',
        method: 'GET',
        params: {
          search,
          sortBy,
          sortOrder,
          isBlocked,
          limit,
          page,
        },
      }),
      providesTags: ['User'],
    }),
    getUser: create.query<User, number>({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: 'GET',
      }),
    }),
    editUser: create.mutation<User, UpdateUserArgs>({
      query: ({ id, data }) => ({
        url: `admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: create.mutation<string, number>({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
} = usersApi;
