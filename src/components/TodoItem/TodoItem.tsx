import { useState } from 'react';
import type { Todo, TodoRequest } from '../../types/todo';
import { deleteTodoApi, editTodoApi } from '../../api/apiTodos';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  type CheckboxChangeEvent,
  type FormProps,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface TodoItemProps {
  todo: Todo;
  fetchTodos: () => void;
}

const TodoItem = ({ todo, fetchTodos }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  async function onDelete(id: number) {
    setErrorText('');
    setIsLoading(true);
    try {
      await deleteTodoApi(id);
      await fetchTodos();
    } catch (error) {
      if (error instanceof Error) {
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

  function handleChangeStatus(e: CheckboxChangeEvent) {
    const isChecked = e.target.checked;
    const newTodoData = {
      isDone: isChecked,
    };
    onEdit(todo.id, newTodoData);
  }

  const handleSubmitTitleChange: FormProps<{
    title: string;
  }>['onFinish'] = async (values) => {
    const todoTitle = values.title;

    try {
      const newTodoData = {
        title: todoTitle,
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
      <Card size='small' style={{ margin: '8px 0px' }}>
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
                <Checkbox checked={todo.isDone} onChange={handleChangeStatus} />

                {isEditing ? (
                  <Form
                    form={form}
                    style={{ maxWidth: 800, width: '100%', padding: 8 }}
                    layout='inline'
                    autoComplete='off'
                    onFinish={handleSubmitTitleChange}
                    initialValues={{ title: todo.title }}
                  >
                    <Form.Item
                      name='title'
                      style={{ flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: 'Это поле не может быть пустым',
                        },
                        {
                          min: 2,
                          message: 'Минимальная длина текста 2 символа',
                        },
                        {
                          max: 64,
                          message: 'Максимальная длина текста 64 символа',
                        },
                      ]}
                    >
                      <Input placeholder='Введите текст задачи...' />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type='primary'
                        htmlType='submit'
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
                type='default'
                disabled={isLoading}
              >
                Отмена
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                color='primary'
                variant='solid'
                icon={<EditOutlined />}
              />
            )}

            <Button
              onClick={() => onDelete(todo.id)}
              color='danger'
              variant='solid'
              icon={<DeleteOutlined />}
            />
          </Col>
        </Row>
      </Card>
      {errorText && <Alert message={errorText} type='error' showIcon />}
    </>
  );
};

export default TodoItem;
