import styles from './TodoItem.module.scss';
import type { Todo, TodoRequest } from '../../lib/types';

interface TodoItemProps {
	todo: Todo;
	handleDelete: (a: number) => void;
	handleEdit: (a: number, b: TodoRequest) => void;
}

export default function TodoItem({
	todo,
	handleDelete,
	handleEdit,
}: TodoItemProps) {
	function onChangeStatus(isChecked: boolean) {
		const newTodoData = {
			title: todo.title,
			isDone: isChecked,
		};
		handleEdit(todo.id, newTodoData);
	}
	return (
		<div className={styles.todoItem}>
			<label className={styles.checkbox}>
				<input
					type="checkbox"
					checked={todo.isDone}
					onChange={(e) => onChangeStatus(e.target.checked)}
				/>
				<span className={todo.isDone ? styles.checkedTask : ''}>
					{todo.title}
				</span>
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
