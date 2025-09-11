import type { FormProps } from 'antd';
import { Alert, Button, Form, Input, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../store/Auth/api';
import type { UserRegistration } from '../../types/types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit/react';

type FieldType = {
  username: string;
  login: string;
  password: string;
  email: string;
  phoneNumber?: string;
};

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registerUser, { isLoading: isRegisteringUser, isSuccess, error }] =
    authApi.useRegisterUserMutation();

  console.log(isSuccess);
  const handleSubmit: FormProps<UserRegistration>['onFinish'] = async ({
    login,
    username,
    password,
    email,
    phoneNumber,
  }) => {
    const newUserData = {
      login,
      username,
      password,
      email,
      phoneNumber,
    };

    await registerUser(newUserData);
    form.resetFields();
  };

  if (isSuccess) {
    return (
      <Result
        status='success'
        title='Вы успешно зарегистрировались!'
        subTitle='Перейдите на страницу авторизации для входа в систему'
        extra={[
          <Button type='primary' onClick={() => navigate('/auth/login')}>
            Перейти на страницу авторизации
          </Button>,
        ]}
      />
    );
  }

  // ошибка приходит в таком формате, чего не ожидаает обработчик, поэтому проверяю наа наличие 'originalStatus' чтобы не ругался ts
  // {
  //   "status": "PARSING_ERROR",
  //   "originalStatus": 409,
  //   "data": "user already exists\n",
  //   "error": "SyntaxError: Unexpected token 'u', \"user already exists\n\" is not valid JSON"
  // }

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ): string => {
    if (error && 'originalStatus' in error) {
      switch (error.originalStatus) {
        case 400:
          return 'Ошибка при обработке запроса. Пожалуйста, проверьте введённые данные.';

        case 409:
          return 'Пользователь с такими данными уже существует';
        case 500:
          return 'Ошибка при обработке запроса. Попробуйте повторить попытку позже.';

        default:
          return 'Что-то пошло не так. Попробуйте повторить попытку позже.';
      }
    }
    return '';
  };

  return (
    <>
      <Form
        name='login'
        size='middle'
        labelAlign='left'
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete='off'
        style={{ width: '100%', maxWidth: '420px', margin: '0' }}
        disabled={isRegisteringUser}
      >
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
          <h3 className='ant-form-text'>Регистрация</h3>
        </Form.Item>

        <Form.Item<FieldType>
          wrapperCol={{ span: 24 }}
          label='Имя пользователя'
          name='username'
          rules={[
            {
              required: true,
              message: 'Это поле не может быть пустым',
            },
            { max: 60, message: 'Максимальная длина имени 60 символов' },
            {
              pattern: /^[a-zа-яё]+$/iu,
              message: 'Неверный формат',
            },
          ]}
          layout='vertical'
        >
          <Input style={{ width: '100%', maxWidth: '420px' }} />
        </Form.Item>

        <Form.Item<FieldType>
          wrapperCol={{ span: 24 }}
          label='Логин'
          name='login'
          rules={[
            {
              required: true,
              message: 'Это поле не может быть пустым',
            },
            { min: 2, message: 'Минимальная длина 2 символов' },
            { max: 60, message: 'Максимальная длина 60 символов' },
            {
              pattern: /^[a-z]+$/iu,
              message: 'Используйте только латинские буквы',
            },
          ]}
          layout='vertical'
        >
          <Input style={{ width: '100%', maxWidth: '420px' }} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 24 }}
          name='password'
          label='Пароль'
          rules={[
            {
              required: true,
              message: 'Введите пароль',
            },
            { min: 6, message: 'Минимальная длина пароля 6 символов' },
            { max: 60, message: 'Максимальная длина пароля 60 символов' },
          ]}
          hasFeedback
          layout='vertical'
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Повторите пароль'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Это поле не может быть пустым',
            },
            { min: 6, message: 'Минимальная длина пароля 6 символов' },
            { max: 60, message: 'Максимальная длина пароля 60 символов' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Пароль не совпадает с тем, что вы ввели ранее')
                );
              },
            }),
          ]}
          layout='vertical'
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          wrapperCol={{ span: 24 }}
          label='Почтовый адрес'
          name='email'
          rules={[
            {
              type: 'email',
              message: 'Неверный формат email',
            },
            {
              required: true,
              message: 'Это поле не может быть пустым',
            },
          ]}
          layout='vertical'
        >
          <Input style={{ width: '100%', maxWidth: '420px' }} />
        </Form.Item>
        <Form.Item<FieldType>
          wrapperCol={{ span: 24 }}
          label='Телефон'
          name='phoneNumber'
          rules={[
            {
              pattern: /^\+[1-9]\d{1,14}$/iu,
              message: 'Неверный формат телефона',
            },
          ]}
          layout='vertical'
        >
          <Input style={{ width: '100%', maxWidth: '420px' }} />
        </Form.Item>

        {error && (
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Alert message={getErrorMessage(error)} type='error' />
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ span: 24 }} label={null}>
          <Button
            style={{ width: '100%', maxWidth: '420px' }}
            type='primary'
            htmlType='submit'
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
        <div>
          Есть аккаунт? <Link to={'/auth/login'}>Войти</Link>
        </div>
      </Form>
    </>
  );
};

export default RegistrationForm;
