import type {
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
  ToDoStatus,
} from "../types/todo";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DATABASE_URL,
});

axiosInstance.interceptors.request.use(
  (res) => {
    return res;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error("interceptors request", error.message);
      throw new Error("Ошибка: " + error.message);
    } else {
      throw new Error("Ошибка отправки данных");
    }
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      throw new Error("Ошибка: " + error.message);
    } else {
      throw new Error("Не удалось получить данные");
    }
  },
);

export async function addTodoApi(title: string): Promise<Todo> {
  const userData = {
    title,
    isDone: false,
  };

  const response = await axiosInstance.post<Todo>("/todos", userData);
  const data = response.data;
  return data;
}

export async function getTodos(
  status: ToDoStatus = "all",
): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await axiosInstance.get<MetaResponse<Todo, TodoInfo>>(
    "/todos",
    {
      params: {
        filter: status,
      },
    },
  );
  const data = response.data;
  return data;
}

export async function deleteTodoApi(id: number): Promise<string> {
  const response = await axiosInstance.delete<string>(`/todos/${id}`);
  const data = response.data;
  return data;
}

export async function editTodoApi(
  id: number,
  todoData: TodoRequest,
): Promise<Todo> {
  const response = await axiosInstance.put<Todo>(`/todos/${id}`, todoData);
  const data = response.data;
  return data;
}
