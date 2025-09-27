import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUserProfile } from '../store/User/user.slice';

const RequireRole = () => {
  const location = useLocation();

  const userProfile = useSelector(selectUserProfile);
  const roles = userProfile?.roles;
  const isAdminOrModerator =
    roles?.includes('ADMIN') || roles?.includes('MODERATOR');

  return isAdminOrModerator ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default RequireRole;
