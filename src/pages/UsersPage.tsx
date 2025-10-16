import React, { useState, type ChangeEvent } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  Input,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Modal,
} from 'antd';
import type { TableProps } from 'antd';
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUnblockUserMutation,
} from '../store/Users/api';
import type { User, UserFilters } from '../types/types';
import { Link } from 'react-router-dom';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuItemType } from 'antd/es/menu/interface';
import UserRolesModal from '../components/UserRolesModal/UserRolesModal';
import { useGetProfileQuery } from '../store/User/api';
import { useSelector } from 'react-redux';
import { selectUserHasRequiredRole } from '../store/User/user.slice';

const { confirm } = Modal;

const filterByBlockedStatusMenuItems: MenuItemType[] = [
  {
    key: '1',
    label: 'Все пользователи',
  },
  {
    key: '2',
    label: 'Только заблокированные пользователи',
  },
  {
    key: '3',
    label: 'Только активные пользователи',
  },
];

type BlockedFilterStatus = true | false | undefined;

const UsersPage: React.FC = () => {
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [userFilters, setUserFilters] = useState<UserFilters>({ limit: 20 });
  const [searchValue, setSearchValue] = useState<string>('');

  const [isBlockedFilterStatus, setIsBlockedFilterStatus] =
    useState<BlockedFilterStatus>(undefined);
  const [selectedIsBlockedFilter, setSelectedIsBlockedFilter] =
    useState<string>('Все пользователи');

  const [blockUser, { isLoading: isBlockingUser }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblockingUser }] =
    useUnblockUserMutation();

  useGetProfileQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const hasRole = useSelector(selectUserHasRequiredRole);
  const isAdmin = hasRole(['ADMIN']);

  // TODO прикрутить дебаунс на поиск
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    error,
  } = useGetUsersQuery(
    {
      sortBy: userFilters?.sortBy,
      sortOrder: userFilters?.sortOrder,
      limit: userFilters?.limit,
      page: userFilters?.page,
      search: searchValue,
      isBlocked: isBlockedFilterStatus,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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
      render: (_, { date }) => {
        const dateObject = new Date(date);
        const formattedDate = dateObject.toLocaleDateString('ru-RU');
        return formattedDate;
      },
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (_, { isBlocked, id }) => {
        return (
          <>
            {isBlocked ? (
              <>
                <Badge status='error' text='Заблокирован' />
                <Button
                  disabled={isUnblockingUser}
                  onClick={() => {
                    confirm({
                      title:
                        'Вы уверены, что хотите разблокировать этого пользователя?',
                      okText: 'Да',
                      cancelText: 'Нет',
                      onOk() {
                        unblockUser(id);
                      },
                    });
                  }}
                  type='link'
                >
                  Разблокировать
                </Button>
              </>
            ) : (
              <>
                <Badge status='success' text='Активен' />
                <Button
                  disabled={isBlockingUser}
                  onClick={() => {
                    confirm({
                      title:
                        'Вы уверены, что хотите заблокировать этого пользователя?',
                      okText: 'Да',
                      cancelText: 'Нет',
                      onOk() {
                        blockUser(id);
                      },
                    });
                  }}
                  type='link'
                >
                  Заблокировать
                </Button>
              </>
            )}
          </>
        );
      },
    },
    {
      title: 'Роли',
      key: 'roles',
      dataIndex: 'roles',

      render: (_, { roles, username }) => (
        <>
          {roles.map((role) => {
            let color;
            switch (role) {
              case 'ADMIN':
                color = 'magenta';
                break;

              case 'MODERATOR':
                color = 'blue';
                break;

              case 'USER':
                color = 'green';
                break;

              default:
                color = 'volcano';
                break;
            }
            return (
              <Tag
                style={{ margin: '3px' }}
                color={color}
                key={`${username}-${role}`}
                bordered={false}
              >
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      key: 'editRole',
      hidden: !isAdmin,
      render: (_, { id, roles }) => {
        return <UserRolesModal id={id} roles={roles} />;
      },
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Link to={`/users/${id}`} key={id}>
          Профиль
        </Link>
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      hidden: !isAdmin,
      render: (id) => (
        <Button
          disabled={isDeletingUser}
          onClick={() => {
            confirm({
              title: 'Вы уверены, что хотите удалить этого пользователя?',
              okText: 'Да',
              cancelText: 'Нет',
              onOk() {
                deleteUser(id);
              },
            });
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

  if (!usersData) {
    return <div>Список пуст</div>;
  }

  return (
    <>
      <Input.Search
        placeholder='Поиск по имени пользователя или email'
        value={searchValue}
        onChange={handleSearchChange}
        enterButton
      />
      {isAdmin && (
        <div style={{ margin: '16px 0' }}>
          <Dropdown
            menu={{
              items: filterByBlockedStatusMenuItems,
              selectable: true,
              defaultSelectedKeys: ['1'],
              onSelect: ({ key }) => {
                setSelectedIsBlockedFilter(
                  (filterByBlockedStatusMenuItems[Number(key) - 1]
                    ?.label as string) ?? 'Все пользователи'
                );

                switch (key) {
                  case '1':
                    setIsBlockedFilterStatus(undefined);
                    break;

                  case '2':
                    setIsBlockedFilterStatus(true);
                    break;

                  case '3':
                    setIsBlockedFilterStatus(false);
                    break;

                  default:
                    break;
                }
              },
            }}
          >
            <Typography.Link>
              <Space>
                {selectedIsBlockedFilter}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
      )}
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
          defaultPageSize: 20,
        }}
        rowKey='id'
      />
    </>
  );
};

export default UsersPage;
