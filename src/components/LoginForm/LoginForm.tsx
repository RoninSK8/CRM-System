import React from 'react';

import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router';

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const LoginForm: React.FC = () => (
  <Form
    name='login'
    size='middle'
    labelAlign='left'
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete='off'
    style={{ width: '100%', maxWidth: '420px', margin: '0' }}
  >
    <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
      <h3 className='ant-form-text'>Войдите в свой аккаунт</h3>
    </Form.Item>
    <Form.Item<FieldType>
      wrapperCol={{ span: 24 }}
      label='Email'
      name='email'
      rules={[
        {
          type: 'email',
          message: 'Неверный формат email',
        },
        {
          required: true,
          message: 'Введите ваш email',
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

export default LoginForm;
