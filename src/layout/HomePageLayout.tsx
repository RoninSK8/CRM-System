import { Button, Layout, Menu, theme, type MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../store/Auth/api';
import { setIsAuthorized } from '../store/Auth/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserProfile, selectUserProfile } from '../store/User/user.slice';
import { useGetProfileQuery, userApi } from '../store/User/api';
const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/todos',
    label: 'Список задач',
  },
  {
    key: '/profile',
    label: 'Профиль',
  },
];

const menuItemsForAdminOrModerator: MenuItem[] = [
  {
    key: '/todos',
    label: 'Список задач',
  },
  {
    key: '/profile',
    label: 'Профиль',
  },
  {
    key: '/users',
    label: 'Пользователи',
  },
];

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const HomePageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser, { isLoading: isLoggingOutUser }] = useLogoutUserMutation();

  useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const userProfile = useSelector(selectUserProfile);
  const roles = userProfile?.roles;
  const isAdminOrModerator =
    roles?.includes('ADMIN') || roles?.includes('MODERATOR');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const handleLogoutClick = () => {
    logoutUser();
    dispatch(setIsAuthorized({ isAuthorized: false }));
    dispatch(clearUserProfile());
    dispatch(userApi.util.invalidateTags(['UserProfile']));
    navigate('/auth/login', { replace: true });
  };

  return (
    <Layout>
      <Sider style={siderStyle} breakpoint='sm' collapsedWidth='0'>
        {/* антд оборачивает контент сайдера в див, поэтому не получается задать justifyContent: 'space-between' сайдеру напрямую, поэтому обернул меню и кнопку логаута в див с флексом, чтобы отнести кнопку логаута вниз */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Menu
            style={{
              padding: 24,
            }}
            theme='dark'
            mode='inline'
            selectedKeys={[location.pathname]}
            items={
              isAdminOrModerator ? menuItemsForAdminOrModerator : menuItems
            }
            onSelect={handleMenuClick}
            inlineIndent={16}
          />

          <Button
            onClick={handleLogoutClick}
            disabled={isLoggingOutUser}
            style={{
              width: '125px',
              display: 'block',
              margin: '24px auto',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            Выйти
          </Button>
        </div>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
      </Layout>
    </Layout>
  );
};

export default HomePageLayout;
