import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUserHasRequiredRole } from '../store/User/user.slice';
import { useGetProfileQuery } from '../store/User/api';
import { Spin } from 'antd';
import type { Role } from '../types/types';

type RequireRoleProps = {
  requiredRoles: Role[];
};
const RequireRole = ({ requiredRoles }: RequireRoleProps) => {
  const location = useLocation();

  const { isLoading: isProfileFetching } = useGetProfileQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const hasRole = useSelector(selectUserHasRequiredRole);
  const userHasRequiredRole = hasRole(requiredRoles);

  if (isProfileFetching) {
    return <Spin />;
  }

  return userHasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default RequireRole;
