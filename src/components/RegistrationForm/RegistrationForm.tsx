import React from 'react';

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { authApi } from '../../store/Auth/api';
import type { UserRegistration } from '../../types/types';

type FieldType = {
  username: string;
  login: string;
  password: string;
  email: string;
  phoneNumber?: string;
};

// const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
//   console.log('Success:', values);
// };

// const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//   console.log('Failed:', errorInfo);
// };

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [registerUser, { isLoading: isRegisteringUser, isSuccess }] =
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

    try {
      await registerUser(newUserData);
      console.log(newUserData);
      form.resetFields();
    } catch (error) {
      // TODO подумать, как правильнее обрабатывать ошибки
      console.error('Error:', error);
    }
  };

  return isSuccess ? (
    <div>
      Вы успешно зарегистрировались!{' '}
      <Link to={'/auth/login'}>
        Перейти на страницу авторизации для входа в систему
      </Link>
    </div>
  ) : (
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
  );
};

export default RegistrationForm;
