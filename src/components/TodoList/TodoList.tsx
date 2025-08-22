import TodoItem from '../TodoItem/TodoItem';
import type { Todo } from '../../types/todo';
import { Alert, Spin } from 'antd';

interface TodoListProps {
	todos: Todo[];
	error: string;
	fetchTodos: () => void;
	isLoading: boolean;
	setIsLoading: (arg: boolean) => void;
}

export default function TodoList({
	error,
	isLoading,
	todos,
	fetchTodos,
	setIsLoading,
}: TodoListProps) {
	return (
		<>
			{error && (
				<Alert message={'Ошибка загрузки данных...'} type="error" showIcon />
			)}
			<div>
				{todos.length > 0 ? (
					todos.map((todo) => {
						return (
							<TodoItem
								key={todo.id}
								todo={todo}
								fetchTodos={fetchTodos}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
							/>
						);
					})
				) : (
					<p>Список задач пуст...</p>
				)}
			</div>
			<div>{isLoading && <Spin />}</div>
		</>
	);
}
