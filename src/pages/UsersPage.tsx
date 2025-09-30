import React from 'react';
import { Button, Spin, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useDeleteUserMutation, useGetUsersQuery } from '../store/Users/api';
import type { User } from '../types/types';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

const UsersPage: React.FC = () => {
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error,
  } = useGetUsersQuery({});
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
    },
    {
      title: 'Роли',
      key: 'roles',
      dataIndex: 'roles',
      render: (_, { roles, username }) => (
        <>
          {roles.map((role) => {
            // TODO выбрать цвета для ролей
            const color = role.length > 5 ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={`${username}-${role}`}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Link to={`/users/${id}`} key={id}>
          Перейти к профилю
        </Link>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Button
          disabled={isDeletingUser}
          onClick={() => {
            const result = confirm(
              'Вы уверены, что хотите удалить этого пользователя?'
            );
            if (result) {
              deleteUser(id);
            }
          }}
          color='danger'
          variant='solid'
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  if (isLoadingUsers) {
    return <Spin />;
  }

  if (error) {
    return;
  }

  return usersData ? (
    <Table<User> columns={columns} dataSource={usersData.data} rowKey='id' />
  ) : (
    <div>список пуст</div>
  );
};

export default UsersPage;
