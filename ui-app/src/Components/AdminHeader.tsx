import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AdminHeader: FC = () => {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/items-list">Items</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/item-groups">Item Groups</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AdminHeader;
