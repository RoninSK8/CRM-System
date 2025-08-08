import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem/TodoItem';
import type { Todo } from '../../lib/types';

interface TodoListProps {
	todos: Todo[];
	error: string;
	isLoading: boolean;
}

export default function TodoList({ error, isLoading, todos }: TodoListProps) {
	// if (isLoading) {
	// 	return <div>Загррузка...</div>;
	// }
	// if (error.length > 0) {
	// 	return <div>Ошибка загрузки данных...</div>;
	// }
	return (
		<>
			{isLoading && <p>Загррузка...</p>}
			{error.length > 0 ? <p>Ошибка загрузки данных...</p> : null}
			<div className={styles.toDoList}>
				{todos.length > 0 ? (
					todos.map((todo) => {
						return <TodoItem key={todo.id} todo={todo} />;
					})
				) : (
					<p>Список задач пуст...</p>
				)}
			</div>
		</>
	);
}
