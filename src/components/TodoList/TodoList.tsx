import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem/TodoItem';
import type { Todo } from '../../types/todo';

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
			{error.length > 0 ? <p>Ошибка загрузки данных...</p> : null}
			<div className={styles.toDoList}>
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
			{isLoading && <p>Загрузка...</p>}
		</>
	);
}
