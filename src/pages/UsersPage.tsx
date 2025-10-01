import React, { useState } from 'react';
import { Button, Spin, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useDeleteUserMutation, useGetUsersQuery } from '../store/Users/api';
import type { User, UserFilters } from '../types/types';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

const UsersPage: React.FC = () => {
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const [userFilters, setUserFilters] = useState<UserFilters>({ limit: 10 });
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    error,
  } = useGetUsersQuery({
    sortBy: userFilters?.sortBy,
    sortOrder: userFilters?.sortOrder,
    limit: userFilters?.limit,
    page: userFilters?.page,
  });

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
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

  const handleTableChange: TableProps<User>['onChange'] = (
    pagination,
    __,
    sorter
  ) => {
    let sortOrder: 'asc' | 'desc' | undefined;
    let sortBy: string | undefined;
    if (!Array.isArray(sorter)) {
      switch (sorter.order) {
        case 'ascend':
          sortOrder = 'asc';
          break;
        case 'descend':
          sortOrder = 'desc';
          break;
        default:
          sortOrder = undefined;
          break;
      }

      sortBy = String(sorter.field);
    }

    setUserFilters({
      sortOrder,
      sortBy,
      limit: pagination.pageSize,
      page: pagination.current ? pagination.current - 1 : undefined,
    });
  };

  if (isLoadingUsers) {
    return <Spin />;
  }

  if (error) {
    return;
  }

  return usersData ? (
    <Table<User>
      size='small'
      columns={columns}
      dataSource={usersData.data}
      onChange={handleTableChange}
      loading={isFetchingUsers}
      pagination={{
        position: ['topCenter', 'bottomCenter'],
        total: usersData?.meta.totalAmount,
        current: userFilters?.page ? userFilters?.page + 1 : undefined,
        responsive: true,
      }}
      rowKey='id'
    />
  ) : (
    <div>список пуст</div>
  );
};

export default UsersPage;
