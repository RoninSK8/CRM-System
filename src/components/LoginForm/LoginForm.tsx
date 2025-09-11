import React from 'react';

import type { FormProps } from 'antd';
import { Alert, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../store/Auth/api';
import type { AuthData } from '../../types/types';
import { useDispatch } from 'react-redux';
import { authTokenChange } from '../../store/Auth/auth.slice';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit/react';

type FieldType = {
  login: string;
  password: string;
  remember?: string;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loginUser, { isLoading, error }] = authApi.useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit: FormProps<AuthData>['onFinish'] = async ({
    login,
    password,
  }) => {
    const loginData = {
      login,
      password,
    };

    try {
      const response = await loginUser(loginData).unwrap();

      dispatch(
        authTokenChange({
          userAccessToken: response.accessToken,
          userRefreshToken: response.refreshToken,
        })
      );
      localStorage.setItem('userRefreshToken', response.refreshToken);
      form.resetFields();
      navigate('/todos', { replace: true });
    } catch (error) {
      // TODO подумать, как правильнее обрабатывать ошибки
      console.error('Error:', error);
    }
  };

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ): string => {
    if (error && 'originalStatus' in error) {
      switch (error.originalStatus) {
        case 400:
          return 'Ошибка при обработке запроса. Пожалуйста, проверьте введённые данные.';
        case 401:
          return 'Неверный логин или пароль';
        case 500:
          return 'Ошибка при обработке запроса. Попробуйте повторить попытку позже.';

        default:
          return 'Что-то пошло не так. Попробуйте повторить попытку позже.';
      }
    }
    return '';
  };

  return (
    <Form
      name='login'
      size='middle'
      labelAlign='left'
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete='off'
      style={{ width: '100%', maxWidth: '420px', margin: '0' }}
      disabled={isLoading}
    >
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
        <h3 className='ant-form-text'>Войдите в свой аккаунт</h3>
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

      <Form.Item<FieldType>
        wrapperCol={{ span: 24 }}
        label='Пароль'
        name='password'
        layout='vertical'
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password style={{ width: '100%', maxWidth: '420px' }} />
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
          Войти
        </Button>
      </Form.Item>
      <div>
        Нет аккаунта? <Link to={'/auth/register'}>Зарегистрироваться</Link>
      </div>
    </Form>
  );
};

export default LoginForm;
