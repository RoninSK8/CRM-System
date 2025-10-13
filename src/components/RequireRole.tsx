import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUserProfile } from '../store/User/user.slice';
import { useGetProfileQuery } from '../store/User/api';
import { Spin } from 'antd';

const RequireRole = () => {
  const location = useLocation();

  const { isLoading: isProfileFetching } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // поменял на более удобную проверку, если ролей будет больше
  const requiredRoles = ['ADMIN', 'MODERATOR'];

  const userProfile = useSelector(selectUserProfile);
  const roles = userProfile?.roles;
  const isRequiredRole = roles?.some((role) => requiredRoles.includes(role));

  if (isProfileFetching) {
    return <Spin />;
  }

  return isRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default RequireRole;
