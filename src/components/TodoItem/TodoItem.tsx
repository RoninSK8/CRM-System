import styles from './TodoItem.module.scss';
import { useState } from 'react';
import type { Todo, TodoRequest } from '../../types/todo';
import { deleteTodoApi, editTodoApi } from '../../api/apiTodos';
import { Button, Checkbox, Form, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

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
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>('');
	const [form] = Form.useForm();

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

	const handleSubmitTitleChange = async () => {
		const todoTitle = form.getFieldsValue().title;
		const trimmedTodoTitle = todoTitle.trim();

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

	const handleCancelEditClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setIsEditing(false);
		setErrorText('');
		form.setFieldValue('title', todo.title);
	};

	return (
		<>
			<div className={styles.todoItem}>
				<label className={styles.checkbox}>
					<Checkbox
						checked={todo.isDone}
						onChange={(e) => onChangeStatus(e.target.checked)}
					/>

					{isEditing ? (
						<Form
							form={form}
							style={{ maxWidth: 800, width: '100%', padding: 8 }}
							layout="inline"
							autoComplete="off"
							onFinish={handleSubmitTitleChange}
							initialValues={{ title: todo.title }}
						>
							<Form.Item
								name="title"
								style={{ flex: 1 }}
								rules={[
									() => ({
										validator(_, value) {
											if (!value.trim()) {
												return Promise.reject(
													new Error('Это поле не может быть пустым')
												);
											}
											if (value.trim().length < 2) {
												return Promise.reject(
													new Error('Минимальная длина текста 2 символа')
												);
											}
											if (value.trim().length > 64) {
												return Promise.reject(
													new Error('Максимальная длина текста 64 символа')
												);
											}
											return Promise.resolve();
										},
									}),
								]}
							>
								<Input placeholder="Введите текст задачи..." />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" disabled={isLoading}>
									Создать
								</Button>
							</Form.Item>
						</Form>
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
							type="default"
							disabled={isLoading}
						>
							Отмена
						</Button>
					) : (
						<Button
							onClick={() => setIsEditing(!isEditing)}
							color="blue"
							variant="solid"
							icon={<EditOutlined />}
						/>
					)}

					<Button
						onClick={() => onDelete(todo.id)}
						color="danger"
						variant="solid"
						icon={<DeleteOutlined />}
					/>
				</div>
			</div>
			{errorText && <span className={styles.error}>{errorText}</span>}
		</>
	);
}
