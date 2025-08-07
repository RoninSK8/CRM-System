import { useState } from 'react';
import styles from './AddTodoForm.module.scss';
import { addTodo } from '../../api/apiTodos';

export default function AddTodoForm() {
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrorText, setValidationErrorText] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (input.trim().length < 2) {
			setValidationErrorText('Минимальная длина текста 2 символа');
			return;
		}
		if (input.trim().length > 64) {
			setValidationErrorText('Максимальная длина текста 64 символа');
			return;
		}
		if (!input.trim()) {
			setValidationErrorText('Это поле не может быть пустым');
			return;
		}

		setIsLoading(true);
		try {
			await addTodo(input);
		} catch (error) {
			setIsLoading(false);
			console.error('Error:', error);
			setValidationErrorText('Ошибка при добавлении задачи.');
			return;
		}

		setInput('');
		setIsLoading(false);
	};

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit}>
				<input
					className={styles.input}
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						setValidationErrorText('');
					}}
					placeholder="Введите текст задачи..."
				/>
				<button disabled={isLoading} className={styles.button}>
					Создать
				</button>
			</form>
			{validationErrorText.length > 0 ? (
				<span className={styles.error}>{validationErrorText}</span>
			) : null}
		</>
	);
}
