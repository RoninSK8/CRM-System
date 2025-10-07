import type {
  GetUsersMetaResponse,
  User,
  UserFilters,
  UserRequest,
  UserRolesRequest,
} from '../../types/types';
import { baseApi } from '../baseApi';

type UpdateUserArgs = {
  data: UserRequest;
  id: number;
};

type UpdateUserRoleArgs = {
  data: UserRolesRequest;
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
    blockUser: create.mutation<User, number>({
      query: (id) => ({
        url: `admin/users/${id}/block`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    unblockUser: create.mutation<User, number>({
      query: (id) => ({
        url: `admin/users/${id}/unblock`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRoles: create.mutation<User, UpdateUserRoleArgs>({
      query: ({ id, data }) => ({
        url: `admin/users/${id}/rights`,
        method: 'POST',
        body: data,
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
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserRolesMutation,
} = usersApi;
