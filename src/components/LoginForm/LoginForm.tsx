import React, { useEffect, useState } from 'react';

import type { FormProps } from 'antd';
import { Alert, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../store/Auth/api';
import type { AuthData } from '../../types/types';
import { useDispatch } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit/react';
import { tokenService } from '../../services/tokenService';
import { setIsAuthorized } from '../../store/Auth/auth.slice';
import { setProfile } from '../../store/User/user.slice';
import { useGetProfileQuery } from '../../store/User/api';

type FieldType = {
  login: string;
  password: string;
  remember?: string;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loginUser, { isLoading: isLoadingLogin, error }] =
    useLoginUserMutation();
  // триггер фетч юзер даты не при рендере, а после логина за счёт установки параметра skip
  const [skip, setSkip] = useState<boolean>(true);
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery(
    undefined,
    {
      skip,
    }
  );
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

      dispatch(setIsAuthorized({ isAuthorized: true }));
      tokenService.setAccessToken({ accessToken: response.accessToken });
      localStorage.setItem('refreshToken', response.refreshToken);

      // триггер фетч юзер даты за счет установки скип в false
      setSkip(false);

      form.resetFields();
      navigate('/todos', { replace: true });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (!skip && profile) {
      console.log('setting user profile from useeffect', profile);

      dispatch(setProfile(profile));
    }
  }, [dispatch, profile, skip]);

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
      form={form}
      name='login'
      size='middle'
      labelAlign='left'
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete='off'
      style={{ width: '100%', maxWidth: '420px', margin: '0' }}
      disabled={isLoadingLogin || isLoadingProfile}
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
