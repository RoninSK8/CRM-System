import styles from './TodoItem.module.scss';
import type { Todo } from '../../lib/types';

interface TodoItemProps {
	todo: Todo;
	handleDelete: (a: number) => void;
}

export default function TodoItem({ todo, handleDelete }: TodoItemProps) {
	return (
		<div className={styles.todoItem}>
			<label className={styles.checkbox}>
				<input type="checkbox" />
				<span>{todo.title}</span>
			</label>
			<button className={styles.editButton}>
				<img
					src="/src/assets/icons/edit.svg"
					width="24"
					height="24"
					alt="редактировать"
				/>
			</button>
			<button
				onClick={() => handleDelete(todo.id)}
				className={styles.deleteButton}
			>
				<img
					src="/src/assets/icons/trash.svg"
					width="24"
					height="24"
					alt="удалить"
				/>
			</button>
		</div>
	);
}
