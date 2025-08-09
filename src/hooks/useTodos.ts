import { useCallback, useEffect, useState } from 'react';
import {
	getTodos,
	addTodoApi,
	deleteTodoApi,
	editTodoApi,
	getTodosInfo,
} from '../api/apiTodos';
import {
	type TodoInfo,
	type Todo,
	type TodoRequest,
	type toDoStatus,
} from '../lib/types';

export default function useTodos() {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [filter, setFilter] = useState<toDoStatus>('all');
	const [todoInfo, setTodoInfo] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const fetchTodos = useCallback(async () => {
		setIsLoading(true);
		try {
			const todos = await getTodos(filter);
			const todoInfo = await getTodosInfo(filter);
			setTodoInfo(todoInfo);
			setTodos(todos);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}, [filter]);

	useEffect(() => {
		fetchTodos();
	}, [filter, fetchTodos]);

	// вариант, если бы надо было выполнить код только один раз на маунт
	// const hasRun = useRef(false);
	// if (!hasRun.current) {
	// 	fetchTodos();
	// 	hasRun.current = true;
	// }

	async function addTodo(title: string) {
		setError('');
		setIsLoading(true);
		try {
			await addTodoApi(title);
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

	async function deleteTodo(id: number) {
		setError('');
		setIsLoading(true);
		try {
			await deleteTodoApi(id);
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
	async function editTodo(id: number, todoData: TodoRequest) {
		setError('');
		setIsLoading(true);
		try {
			await editTodoApi(id, todoData);
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

	return {
		error,
		isLoading,
		todos,
		addTodo,
		deleteTodo,
		editTodo,
		filter,
		setFilter,
		todoInfo,
	};
}
