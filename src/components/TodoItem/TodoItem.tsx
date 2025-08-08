import styles from './TodoItem.module.scss';
import type { Todo } from '../../lib/types';

interface TodoItemProps {
	todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
	return (
		<div className={styles.todoItem}>
			<label className={styles.checkbox}>
				<input type="checkbox" />
				<span>{todo.title}</span>
			</label>
		</div>
	);
}
