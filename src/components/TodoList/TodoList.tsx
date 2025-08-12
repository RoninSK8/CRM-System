import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem/TodoItem';
import type { Todo, TodoRequest } from '../../types/todo';

interface TodoListProps {
	todos: Todo[];
	error: string;
	isLoading: boolean;
	onDelete: (a: number) => void;
	onEdit: (a: number, b: TodoRequest) => void;
}

export default function TodoList({
	error,
	isLoading,
	todos,
	onDelete,
	onEdit,
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
								onDelete={onDelete}
								onEdit={onEdit}
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
