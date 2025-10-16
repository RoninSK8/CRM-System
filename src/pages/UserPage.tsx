import { Spin, Form, Input, Button, type FormProps, Space } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useEditUserMutation, useGetUserQuery } from '../store/Users/api';
import { useState } from 'react';
import type { UserRequest } from '../types/types';

const UserPage = () => {
  const { id } = useParams();
  const userId = Number(id);
  const [isEditingDisabled, setIsEditingDisabled] = useState<boolean>(true);
  const { data: user, isLoading } = useGetUserQuery(userId);
  const [form] = Form.useForm();

  const [editUser, { isLoading: isEditingUser }] = useEditUserMutation();

  const handleSubmit: FormProps<UserRequest>['onFinish'] = async (formData) => {
    if (!user) {
      return;
    }

    const newUserData: UserRequest = {};

    let key: keyof UserRequest;
    for (key in formData) {
      if (formData[key] !== user[key]) {
        newUserData[key] = formData[key];
      }
    }

    await editUser({ id: userId, data: newUserData });

    setIsEditingDisabled(true);
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <Form
        // {...formItemLayout}
        form={form}
        variant={'borderless'}
        style={{
          maxWidth: 600,
        }}
        size='large'
        initialValues={{ variant: 'filled' }}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label='Имя пользователя'
          name='username'
          initialValue={user?.username}
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
        >
          <Input disabled={isEditingDisabled || isEditingUser} />
        </Form.Item>
        <Form.Item
          label='Email пользователя'
          name='email'
          initialValue={user?.email}
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
        >
          <Input disabled={isEditingDisabled || isEditingUser} />
        </Form.Item>
        <Form.Item
          label='Телефон'
          name='phoneNumber'
          initialValue={user?.phoneNumber}
          rules={[
            {
              pattern: /^\+[1-9]\d{1,14}$/iu,
              message: 'Неверный формат телефона',
            },
          ]}
        >
          <Input disabled={isEditingDisabled || isEditingUser} />
        </Form.Item>

        <Space>
          {isEditingDisabled ? (
            <Form.Item>
              <Button
                size='middle'
                type='primary'
                onClick={() => {
                  setIsEditingDisabled(false);
                }}
              >
                Редактировать
              </Button>
            </Form.Item>
          ) : (
            <>
              <Form.Item>
                <Button
                  size='middle'
                  onClick={() => {
                    setIsEditingDisabled(true);
                  }}
                >
                  Отмена
                </Button>
              </Form.Item>
              <Form.Item>
                <Button size='middle' type='primary' htmlType='submit'>
                  Сохранить
                </Button>
              </Form.Item>
            </>
          )}
        </Space>
      </Form>
      <Button size='middle' style={{ display: 'block', marginTop: '30px' }}>
        <Link to={'/users'}>К списку пользователей</Link>
      </Button>
    </>
  );
};

export default UserPage;
