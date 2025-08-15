import styles from './TodoItem.module.scss';
import { useState } from 'react';
import type { Todo, TodoRequest } from '../../types/todo';
import validateTodoTitle from '../../utils/validate';
import Button from '../../ui/Button/Button';
import { deleteTodoApi, editTodoApi } from '../../api/apiTodos';
import IconButton from '../../ui/IconButton/IconButton';

interface TodoItemProps {
	todo: Todo;
	isLoading: boolean;
	setIsLoading: (arg: boolean) => void;
	fetchTodos: () => void;
}

export default function TodoItem({
	todo,
	isLoading,
	setIsLoading,
	fetchTodos,
}: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [todoTitle, setTodoTitle] = useState(todo.title);
	const [errorText, setErrorText] = useState('');

	async function onDelete(id: number) {
		setErrorText('');
		setIsLoading(true);
		try {
			await deleteTodoApi(id);
			await fetchTodos();
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
				setErrorText(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function onEdit(id: number, todoData: TodoRequest) {
		setErrorText('');
		setIsLoading(true);
		try {
			await editTodoApi(id, todoData);
			fetchTodos();
		} catch (error) {
			if (error instanceof Error) {
				setErrorText(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

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

		if (validateTodoTitle(trimmedTodoTitle)) {
			setErrorText(validateTodoTitle(trimmedTodoTitle));
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

							<Button disabled={isLoading}>Сохранить</Button>
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
						<IconButton
							onClick={() => setIsEditing(!isEditing)}
							className={styles.editButton}
							icon={
								<img
									src={'/icons/edit.svg'}
									className={styles.icon}
									width="24"
									height="24"
									alt="edit icon"
								></img>
							}
						></IconButton>
					)}

					<IconButton
						onClick={() => onDelete(todo.id)}
						colorVariant="danger"
						className={styles.deleteButton}
						icon={
							<img
								src={'/icons/trash.svg'}
								className={styles.icon}
								width="24"
								height="24"
								alt="delete icon"
							></img>
						}
					></IconButton>
				</div>
			</div>
			{errorText && <span className={styles.error}>{errorText}</span>}
		</>
	);
}
