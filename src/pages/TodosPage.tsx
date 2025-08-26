import { useCallback, useEffect, useState } from 'react';
import type { Todo, TodoInfo, ToDoStatus } from '../types/todo';
import { getTodos } from '../api/apiTodos';
import AddTodoForm from '../components/AddTodoForm/AddTodoForm';
import FilterTabList from '../components/FilterTabList/FilterTabList';
import TodoList from '../components/TodoList/TodoList';
import { Spin } from 'antd';

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

			// Сравниваю, отличается ли новый info список от текущего, если да, то обновляю его.
			if (info && JSON.stringify(info) !== JSON.stringify(todoInfo)) {
				setTodoInfo(info);
			}
			// TODO
			// Сравниваю, отличается ли новый список от текущего, если да, то обновляю его.
			if (JSON.stringify(data) !== JSON.stringify(todos)) {
				setTodos(data);
			}
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}, [filter, todos, todoInfo]);

	useEffect(() => {
		fetchTodos();
		const fetchInterval = setInterval(() => {
			fetchTodos();
		}, 5000);
		return () => clearInterval(fetchInterval);
	}, [filter, fetchTodos]);

	return (
		<>
			<AddTodoForm fetchTodos={fetchTodos} />
			<FilterTabList
				filter={filter}
				setFilter={setFilter}
				todoInfo={todoInfo}
			/>
			<TodoList todos={todos} error={error} fetchTodos={fetchTodos} />
			{isLoading && <Spin />}
		</>
	);
}

export default TodosPage;
