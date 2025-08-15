import type {
	MetaResponse,
	Todo,
	TodoInfo,
	TodoRequest,
	ToDoStatus,
} from '../types/todo';

export async function addTodoApi(title: string): Promise<Todo> {
	const userData = {
		title,
		isDone: false,
	};
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	if (response.ok) {
		const data: Todo = await response.json();
		return data;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
export async function getTodos(
	status: ToDoStatus = 'all'
): Promise<MetaResponse<Todo, TodoInfo>> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos?filter=${status}`, {
		method: 'GET',
	});

	if (response.ok) {
		const data: MetaResponse<Todo, TodoInfo> = await response.json();
		return data;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}

export async function deleteTodoApi(id: number): Promise<string> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos/${id}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		const data: string = await response.text();
		return data;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
export async function editTodoApi(
	id: number,
	todoData: TodoRequest
): Promise<Todo> {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos/${id}`, {
		method: 'PUT',
		body: JSON.stringify(todoData),
	});

	if (response.ok) {
		const data: Todo = await response.json();
		return data;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
