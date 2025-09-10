import React from 'react';

import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  top: 0,
  bottom: 0,
};

const Authorization: React.FC = () => (
  <Layout style={layoutStyle}>
    <Sider width='57%'>Sider</Sider>
    <Content
      style={{
        padding: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Outlet />
    </Content>
  </Layout>
);

export default Authorization;
