import { useEffect, useState } from 'react';
import { getTodos, postTodo } from '../api/apiTodos';
import type { Todo } from '../lib/types';

export default function useTodos() {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [todos, setTodos] = useState<Todo[]>([]);

	const fetchTodos = async () => {
		setIsLoading(true);
		try {
			const todos = await getTodos();
			setTodos(todos);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	async function addTodo(title: string) {
		setError('');
		setIsLoading(true);
		try {
			await postTodo(title);
			fetchTodos();
		} catch (error) {
			setIsLoading(false);
			if (error instanceof Error) {
				setError(error.message);
			}
			return;
		} finally {
			setIsLoading(false);
		}
	}

	return { error, isLoading, todos, addTodo };
}
