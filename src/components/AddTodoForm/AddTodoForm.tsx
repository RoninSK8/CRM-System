import { useState } from 'react';
import styles from './AddTodoForm.module.scss';
import { addTodoApi } from '../../api/apiTodos';
import validate from '../../utils/validate';
import Button from '../../ui/Button/Button';

interface AddTodoFormProps {
	isLoading: boolean;
	fetchTodos: () => void;
	setIsLoading: (arg: boolean) => void;
}

export default function HandleAddTodoForm({
	isLoading,
	fetchTodos,
	setIsLoading,
}: AddTodoFormProps) {
	const [todoTitle, setTodoTitle] = useState('');
	const [errorText, setErrorText] = useState('');

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmedTodoTitle = todoTitle.trim();

		if (validate(trimmedTodoTitle)) {
			setErrorText(validate(trimmedTodoTitle));
			return;
		}

		setErrorText('');
		setIsLoading(true);
		try {
			await addTodoApi(trimmedTodoTitle);
			fetchTodos();
		} catch (error) {
			console.error('Error:', error);
			setErrorText('Ошибка при добавлении задачи.');
		} finally {
			setIsLoading(false);
			setTodoTitle('');
		}
	};

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTodoTitle(e.target.value);
		setErrorText('');
	}

	return (
		<>
			<form className={styles.form} onSubmit={onSubmit}>
				<input
					className={styles.input}
					value={todoTitle}
					onChange={handleInputChange}
					placeholder="Введите текст задачи..."
				/>
				{/* <button disabled={isLoading} className={styles.button}>
					Создать
				</button> */}

				<Button disabled={isLoading} className={styles.button}>
					Создать
				</Button>
			</form>
			{errorText && <span className={styles.error}>{errorText}</span>}
		</>
	);
}
