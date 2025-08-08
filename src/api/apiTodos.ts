import type { Todo, toDoStatus } from '../lib/types';

export async function addTodoApi(title: string) {
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
		return response.body;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
export async function getTodos(status: toDoStatus = 'all') {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos?filter=${status}`, {
		method: 'GET',
	});

	if (response.ok) {
		const todos = await response.json();
		return todos.data as Todo[];
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
export async function deleteTodoApi(id: number) {
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos/${id}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		return response.body;
	} else {
		throw new Error('Ошибка: ' + response.status);
	}
}
