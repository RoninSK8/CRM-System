import { useState } from 'react';
import type { Todo, TodoRequest } from '../../types/todo';
import { deleteTodoApi, editTodoApi } from '../../api/apiTodos';
import { Alert, Button, Card, Checkbox, Col, Form, Input, Row } from 'antd';
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
		form.setFieldsValue({ title: todo.title });
	};

	return (
		<>
			<Card size="small" style={{ margin: '8px 0px' }}>
				<Row>
					<Col
						span={18}
						style={{
							display: 'flex',
							justifyContent: 'start',
							gap: '20px',
						}}
					>
						<Row>
							<label
								style={{
									display: 'flex',
									justifyContent: 'start',
									alignItems: 'center',
									gap: '20px',
								}}
							>
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
																new Error(
																	'Максимальная длина текста 64 символа'
																)
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
											<Button
												type="primary"
												htmlType="submit"
												disabled={isLoading}
											>
												Сохранить
											</Button>
										</Form.Item>
									</Form>
								) : (
									<p
										style={{
											textDecorationLine: todo.isDone ? 'line-through' : 'none',
										}}
									>
										{todo.title}
									</p>
								)}
							</label>
						</Row>
					</Col>
					<Col
						span={6}
						style={{
							display: 'flex',
							justifyContent: 'end',
							alignItems: 'center',
							gap: '20px',
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
					</Col>
				</Row>
			</Card>
			{errorText && <Alert message={errorText} type="error" showIcon />}
		</>
	);
}
