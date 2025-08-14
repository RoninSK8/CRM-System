import { useCallback, useEffect, useState } from 'react';
import type { Todo, TodoInfo, ToDoStatus } from '../types/todo';
import { getTodos } from '../api/apiTodos';
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
			const { data, info } = await getTodos(filter);

			if (info) {
				setTodoInfo(info);
			} else {
				setError('Ошибка при загрузке данных о количестве задач');
			}

			setTodos(data);
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
					error={error}
					fetchTodos={fetchTodos}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
				/>
			</div>
		</main>
	);
}

export default TodosPage;
