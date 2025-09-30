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

  const userProfile = useSelector(selectUserProfile);
  const roles = userProfile?.roles;
  const isAdminOrModerator =
    roles?.includes('ADMIN') || roles?.includes('MODERATOR');

  if (isProfileFetching) {
    return <Spin />;
  }

  return isAdminOrModerator ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default RequireRole;
