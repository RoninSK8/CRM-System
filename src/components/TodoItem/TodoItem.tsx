import styles from './TodoItem.module.scss';
import { useState } from 'react';
import type { Todo, TodoRequest } from '../../types/todo';
import validate from '../../utils/validate';
import Button from '../../ui/Button/Button';

interface TodoItemProps {
	todo: Todo;
	onDelete: (a: number) => void;
	onEdit: (a: number, b: TodoRequest) => void;
}

export default function TodoItem({ todo, onDelete, onEdit }: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [todoTitle, setTodoTitle] = useState(todo.title);
	const [errorText, setErrorText] = useState('');

	function onChangeStatus(isChecked: boolean) {
		const newTodoData = {
			isDone: isChecked,
		};
		onEdit(todo.id, newTodoData);
	}

	const handleSubmitTitleChange = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const trimmedTodoTitle = todoTitle.trim();

		if (validate(trimmedTodoTitle)) {
			setErrorText(validate(trimmedTodoTitle));
			return;
		}

		try {
			const newTodoData = {
				title: trimmedTodoTitle,
			};
			await onEdit(todo.id, newTodoData);
		} catch (error) {
			console.error('Error:', error);
			setErrorText('Ошибка при добавлении задачи.');
			return;
		}
		setIsEditing(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoTitle(e.target.value);
		setErrorText('');
	};

	const handleCancelEditClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setIsEditing(false);
		setErrorText('');
		setTodoTitle(todo.title);
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
						<form className={styles.form} onSubmit={handleSubmitTitleChange}>
							<input
								className={styles.input}
								value={todoTitle}
								onChange={handleInputChange}
								placeholder="Введите текст задачи..."
							/>

							<Button>Сохранить</Button>
						</form>
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
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: '20px',
						backgroundColor: 'white',
					}}
				>
					{isEditing ? (
						<Button
							onClick={handleCancelEditClick}
							className={styles.cancelChangesButton}
							colorVariant="secondary"
						>
							Отмена
						</Button>
					) : (
						<Button
							onClick={() => setIsEditing(!isEditing)}
							className={styles.editButton}
							icon="edit"
						></Button>
					)}

					<Button
						onClick={() => onDelete(todo.id)}
						colorVariant="danger"
						className={styles.deleteButton}
						icon="trash"
					></Button>
				</div>
			</div>
			{errorText && <span className={styles.error}>{errorText}</span>}
		</>
	);
}
