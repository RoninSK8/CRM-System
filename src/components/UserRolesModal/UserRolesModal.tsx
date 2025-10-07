import { useState } from 'react';
import { Button, Checkbox, Modal } from 'antd';
import type { Role } from '../../types/types';
import { useUpdateUserRolesMutation } from '../../store/Users/api';
import { EditOutlined } from '@ant-design/icons';

const possibleUserRoles: Role[] = ['USER', 'MODERATOR', 'ADMIN'];

interface UserRolesModalProps {
  id: number;
  roles: Role[];
}

const UserRolesModal = ({ id, roles }: UserRolesModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRolesCheckboxValues, setEditRolesCheckboxValues] = useState<
    Role[]
  >([]);
  const [updateUserRoles, { isLoading: isUpdatingUserRole }] =
    useUpdateUserRolesMutation();

  const handleRolesModalChange = async (checkedValues: Role[]) => {
    await setEditRolesCheckboxValues(checkedValues);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    updateUserRoles({
      id,
      data: { roles: editRolesCheckboxValues },
    });

    setEditRolesCheckboxValues([]);

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setEditRolesCheckboxValues([]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button icon={<EditOutlined />} type='text' onClick={showModal}></Button>
      <Modal
        title='Управление ролями пользователя'
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isUpdatingUserRole}
        okText='Сохранить'
        cancelText='Отмена'
      >
        <Checkbox.Group onChange={handleRolesModalChange} defaultValue={roles}>
          {possibleUserRoles.map((possibleUserRole) => {
            return (
              <Checkbox
                key={`${id}-possibleUserRole-${possibleUserRole}`}
                value={possibleUserRole}
              >
                {possibleUserRole}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default UserRolesModal;
