import { Layout, Menu, theme, type MenuProps } from 'antd';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/todos',
    label: 'Список задач',
  },
  {
    key: '/profile',
    label: 'Профиль',
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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Sider style={siderStyle} breakpoint='lg' collapsedWidth='0'>
        <div className='demo-logo-vertical' />
        <Menu
          style={{
            padding: 24,
          }}
          theme='dark'
          mode='inline'
          selectedKeys={[location.pathname]}
          items={items}
          onSelect={onClick}
        />
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
