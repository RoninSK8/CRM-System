import { useState } from 'react';
import { Alert, Button, Form, Input, type FormProps } from 'antd';
import { useAddTodoMutation } from '../../store/Todos/api';

const AddTodoForm = () => {
  const [errorText, setErrorText] = useState<string>('');
  const [form] = Form.useForm();

  const [addTodo, { isLoading: isAddingTodo }] = useAddTodoMutation();

  const onSubmit: FormProps<{ title: string }>['onFinish'] = async (values) => {
    const todoTitle = values.title;

    try {
      await addTodo(todoTitle);
      form.resetFields();
    } catch (error) {
      // TODO подумать, как правильнее обрабатывать ошибки
      console.error('Error:', error);
      setErrorText('Ошибка при добавлении задачи.');
    }
  };

  return (
    <>
      <Form
        form={form}
        style={{ width: '100%', padding: 8 }}
        layout='inline'
        autoComplete='off'
        onFinish={onSubmit}
      >
        <Form.Item
          name='title'
          style={{ flex: 1 }}
          rules={[
            {
              required: true,
              message: 'Это поле не может быть пустым',
            },
            { min: 2, message: 'Минимальная длина текста 2 символа' },
            { max: 64, message: 'Максимальная длина текста 64 символа' },
          ]}
        >
          <Input placeholder='Введите текст задачи...' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' disabled={isAddingTodo}>
            Создать
          </Button>
        </Form.Item>
      </Form>
      {errorText && <Alert message={errorText} type='error' showIcon />}
    </>
  );
};

export default AddTodoForm;
