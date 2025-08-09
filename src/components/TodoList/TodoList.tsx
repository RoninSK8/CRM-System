import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem/TodoItem';
import type { Todo, TodoRequest } from '../../lib/types';

interface TodoListProps {
	todos: Todo[];
	error: string;
	isLoading: boolean;
	handleDelete: (a: number) => void;
	handleEdit: (a: number, b: TodoRequest) => void;
}

export default function TodoList({
	error,
	isLoading,
	todos,
	handleDelete,
	handleEdit,
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
								handleDelete={handleDelete}
								handleEdit={handleEdit}
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
