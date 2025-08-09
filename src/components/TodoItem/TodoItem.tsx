import styles from './TodoItem.module.scss';
import type { Todo, TodoRequest } from '../../lib/types';
import { useState } from 'react';

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
	const [isEditing, setIsEditing] = useState(false);
	const [input, setInput] = useState(todo.title);
	const [validationErrorText, setValidationErrorText] = useState('');
	function onChangeStatus(isChecked: boolean) {
		const newTodoData = {
			title: todo.title,
			isDone: isChecked,
		};
		handleEdit(todo.id, newTodoData);
	}
	const handleSubmitTitleChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!input.trim()) {
			setValidationErrorText('Это поле не может быть пустым');
			return;
		}
		if (input.trim().length < 2) {
			setValidationErrorText('Минимальная длина текста 2 символа');
			return;
		}
		if (input.trim().length > 64) {
			setValidationErrorText('Максимальная длина текста 64 символа');
			return;
		}

		try {
			const newTodoData = {
				title: input,
				isDone: todo.isDone,
			};
			await handleEdit(todo.id, newTodoData);
		} catch (error) {
			console.error('Error:', error);
			setValidationErrorText('Ошибка при добавлении задачи.');
			return;
		}
		setIsEditing(false);
		// setInput('');
	};
	return (
		<>
			<div className={styles.todoItem}>
				<label className={styles.checkbox}>
					<input
						type="checkbox"
						checked={todo.isDone}
						onChange={(e) => onChangeStatus(e.target.checked)}
					/>
					{isEditing ? (
						<>
							<form className={styles.form} onSubmit={handleSubmitTitleChange}>
								<input
									className={styles.input}
									value={input}
									onChange={(e) => {
										setInput(e.target.value);
										setValidationErrorText('');
									}}
									placeholder="Введите текст задачи..."
								/>
								<button className={styles.saveChangesButton}>Сохранить</button>
							</form>
							<button
								onClick={(e) => {
									e.preventDefault();
									setIsEditing(false);
									setValidationErrorText('');
								}}
								className={styles.cancelChangesButton}
							>
								Отмена
							</button>
						</>
					) : (
						<span
							className={
								todo.isDone ? styles.checkedTask : styles.unCheckedTask
							}
						>
							{todo.title}
						</span>
					)}
				</label>
				{!isEditing && (
					<button
						onClick={() => setIsEditing(!isEditing)}
						className={styles.editButton}
					>
						<img
							src="/src/assets/icons/edit.svg"
							width="24"
							height="24"
							alt="редактировать"
						/>
					</button>
				)}
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
			{validationErrorText.length > 0 ? (
				<span className={styles.error}>{validationErrorText}</span>
			) : null}
		</>
	);
}
