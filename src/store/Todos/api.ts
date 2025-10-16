import { baseApi } from '../baseApi';
import type {
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
  ToDoStatus,
} from '../../types/types';

export const todosApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getTodos: create.query<MetaResponse<Todo, TodoInfo>, ToDoStatus>({
      query: (status) => ({
        url: 'todos',
        method: 'GET',
        params: {
          filter: status,
        },
      }),
      // присваиваем тэги, чтобы мы их потом могли инвалидировать для рефетча
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Todo' as const, id })),
              'Todo',
            ]
          : ['Todo'],
    }),
    addTodo: create.mutation<Todo, string>({
      query: (title) => ({
        url: 'todos',
        method: 'POST',
        body: {
          title,
          isDone: false,
        },
      }),
      // Фетчим список заново при добавлении задачи
      invalidatesTags: ['Todo'],
    }),
    editTodo: create.mutation<Todo, { id: number; todoData: TodoRequest }>({
      query: ({ id, todoData }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: todoData,
      }),
      // Инвалидируем теги для того, чтобы происходил рефетч после мутаций
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: create.mutation<void, number>({
      query: (id) => ({ method: 'DELETE', url: `/todos/${id}` }),
      // Инвалидируем тег для обновления списка после удаления тудухи
      invalidatesTags: ['Todo'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useGetTodosQuery,
} = todosApi;
