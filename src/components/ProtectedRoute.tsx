import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthorized, setIsAuthorized } from '../store/Auth/auth.slice';
import { useUpdateTokensMutation } from '../store/Auth/api';
import type { Token } from '../types/types';
import { tokenService } from '../services/tokenService';
import { Spin } from 'antd';

type ProtectedRouteProps = {
  redirectTo?: string;
  children?: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/auth/login',
  children,
}) => {
  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorized);
  const [updateTokens] = useUpdateTokensMutation();
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    async function restoreAccessToken() {
      // проверяем, был ли уже запрос, сделано для того, чтобы избежать повторного запроса в стрикт моде
      if (hasChecked.current) {
        return;
      }
      hasChecked.current = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        tokenService.clearAccessToken();
        localStorage.removeItem('refreshToken');
        dispatch(setIsAuthorized({ isAuthorized: false }));
        setIsLoadingAuth(false);
        return;
      }

      const refreshResult = await updateTokens({ refreshToken });

      if (refreshResult.data) {
        const tokenResponse = refreshResult.data as Token;
        tokenService.setAccessToken({ accessToken: tokenResponse.accessToken });
        localStorage.setItem('refreshToken', tokenResponse.refreshToken);
        dispatch(setIsAuthorized({ isAuthorized: true }));
      } else {
        dispatch(setIsAuthorized({ isAuthorized: false }));
      }
      setIsLoadingAuth(false);
    }
    restoreAccessToken();
  }, [dispatch, updateTokens]);

  if (isLoadingAuth) {
    return <Spin />;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
