import { Navigate, Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';

type ProtectedRouteProps = {
  redirectTo?: string;
  children?: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/auth/login',
  children,
}) => {
  const refreshToken = localStorage.getItem('userRefreshToken');
  if (!refreshToken) {
    return <Navigate to={redirectTo} replace />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
