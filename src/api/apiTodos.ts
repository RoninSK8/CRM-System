import type {
	MetaResponse,
	Todo,
	TodoInfo,
	TodoRequest,
	ToDoStatus,
} from '../types/todo';
import axios from 'axios';

export async function addTodoApi(title: string): Promise<Todo> {
	const userData = {
		title,
		isDone: false,
	};
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;

	try {
		const response = await axios.post(`${databaseUrl}/todos`, userData);
		const data: Todo = response.data;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error('Ошибка: ' + error.message);
		} else {
			throw new Error('Ошибка при добавлении задачи');
		}
	}
}

export async function getTodos(
	status: ToDoStatus = 'all'
): Promise<MetaResponse<Todo, TodoInfo>> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;

	try {
		const response = await axios.get(`${databaseUrl}/todos?filter=${status}`);
		const data: MetaResponse<Todo, TodoInfo> = response.data;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error('Ошибка: ' + error.message);
		} else {
			throw new Error('Ошибка при загрузке задач');
		}
	}
}

export async function deleteTodoApi(id: number): Promise<string> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;

	try {
		const response = await axios.delete(`${databaseUrl}/todos/${id}`);
		const data: string = response.data;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error('Ошибка: ' + error.message);
		} else {
			throw new Error('Ошибка при удалении задачи');
		}
	}
}

export async function editTodoApi(
	id: number,
	todoData: TodoRequest
): Promise<Todo> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;

	try {
		const response = await axios.put(`${databaseUrl}/todos/${id}`, todoData);
		const data: Todo = response.data;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error('Ошибка: ' + error.message);
		} else {
			throw new Error('Ошибка при редактировании задачи');
		}
	}
}
