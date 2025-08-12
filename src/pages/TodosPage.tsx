import { useCallback, useEffect, useState } from 'react';
import type { Todo, TodoInfo, TodoRequest, ToDoStatus } from '../types/todo';
import {
	// addTodoApi,
	deleteTodoApi,
	editTodoApi,
	getTodos,
} from '../api/apiTodos';
import AddTodoForm from '../components/AddTodoForm/AddTodoForm';
import FilterTabList from '../components/FilterTabList/FilterTabList';
import TodoList from '../components/TodoList/TodoList';

export function TodosPage() {
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [filter, setFilter] = useState<ToDoStatus>('all');
	const [todoInfo, setTodoInfo] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const fetchTodos = useCallback(async () => {
		setIsLoading(true);
		try {
			const todosResponse = await getTodos(filter);
			const todos = todosResponse.data;
			const todoInfo = todosResponse.info;
			if (!todoInfo) {
				setError('Ошибка при загрузке данных о количестве задач');
			} else {
				setTodoInfo(todoInfo);
			}
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

	// async function addTodo(title: string) {
	// 	setError('');
	// 	setIsLoading(true);
	// 	try {
	// 		await addTodoApi(title);
	// 		fetchTodos();
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			setError(error.message);
	// 		}
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// }

	async function deleteTodo(id: number) {
		setError('');
		setIsLoading(true);
		try {
			await deleteTodoApi(id);
			await fetchTodos();
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
				setError(error.message);
			}
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
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main>
			<div className="todo">
				<AddTodoForm
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					fetchTodos={fetchTodos}
				/>
				<FilterTabList
					filter={filter}
					setFilter={setFilter}
					todoInfo={todoInfo}
				/>
				<TodoList
					todos={todos}
					isLoading={isLoading}
					error={error}
					onDelete={deleteTodo}
					onEdit={editTodo}
				/>
			</div>
		</main>
	);
}

export default TodosPage;
