import React from 'react';

import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../store/Auth/api';
import type { AuthData } from '../../types/types';
import { useDispatch } from 'react-redux';
import { authTokenChange } from '../../store/Auth/auth.slice';

type FieldType = {
  login: string;
  password: string;
  remember?: string;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loginUser, { isLoading }] = authApi.useLoginUserMutation();
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
      form.resetFields();
      navigate('/todos', { replace: true });
    } catch (error) {
      // TODO подумать, как правильнее обрабатывать ошибки
      console.error('Error:', error);
    }
  };

  return (
    <Form
      name='login'
      size='middle'
      labelAlign='left'
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      // onFinishFailed={onFinishFailed}
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

      <Form.Item<FieldType>
        wrapperCol={{ span: 20 }}
        name='remember'
        valuePropName='checked'
        label={null}
      >
        <Checkbox>Запомнить меня</Checkbox>
      </Form.Item>

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
