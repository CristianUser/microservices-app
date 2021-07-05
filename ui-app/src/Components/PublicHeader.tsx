import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const PublicHeader: FC = () => {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="0">
          <Link to="/">Home</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default PublicHeader;
