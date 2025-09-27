import React from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: string[];
  phoneNumber: string;
}

const columns: TableProps<DataType>['columns'] = [
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
          let color = role.length > 5 ? 'geekblue' : 'green';
          if (role === 'loser') {
            color = 'volcano';
          }
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
];

const data: DataType[] = [
  {
    key: 'john_doe',
    username: 'john_doe',
    email: 'john.doe@example.com',
    date: '2025-09-01',
    isBlocked: false,
    roles: ['user'],
    phoneNumber: '+1-202-555-0123',
  },
  {
    key: 'jane_admin',
    username: 'jane_admin',
    email: 'jane.admin@example.com',
    date: '2025-08-15',
    isBlocked: false,
    roles: ['admin', 'user'],
    phoneNumber: '+44-7700-900123',
  },
  {
    key: 'mark_smith',
    username: 'mark_smith',
    email: 'mark.smith@example.com',
    date: '2025-07-20',
    isBlocked: true,
    roles: ['moderator'],
    phoneNumber: '+49-151-23456789',
  },
];

const UsersPage: React.FC = () => (
  <Table<DataType> columns={columns} dataSource={data} />
);

export default UsersPage;
