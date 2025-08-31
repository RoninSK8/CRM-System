import { memo, useState } from 'react';
import { addTodoApi } from '../../api/apiTodos';
import { Alert, Button, Form, Input, type FormProps } from 'antd';

interface AddTodoFormProps {
  fetchTodos: () => void;
}

const AddTodoForm = memo(({ fetchTodos }: AddTodoFormProps) => {
  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onSubmit: FormProps<{ title: string }>['onFinish'] = async (values) => {
    const todoTitle = values.title;

    setErrorText('');
    setIsLoading(true);
    try {
      await addTodoApi(todoTitle);
      fetchTodos();
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      setErrorText('Ошибка при добавлении задачи.');
    } finally {
      setIsLoading(false);
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
          <Button type='primary' htmlType='submit' disabled={isLoading}>
            Создать
          </Button>
        </Form.Item>
      </Form>
      {errorText && <Alert message={errorText} type='error' showIcon />}
    </>
  );
});

export default AddTodoForm;
