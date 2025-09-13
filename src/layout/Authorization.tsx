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
    <Sider
      width='57%'
      style={{
        backgroundColor: '#FFE6C9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <img
          src='/skeletonImage.png'
          style={{ width: '100%' }}
          alt='skeleton'
        />
      </div>
    </Sider>
    <Content
      style={{
        padding: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <Outlet />
    </Content>
  </Layout>
);

export default Authorization;
