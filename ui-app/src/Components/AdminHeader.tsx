import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
const { Header } = Layout;

const AdminHeader: FC = (props) =>{
    return (
    <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item><Link to="/">Home</Link></Menu.Item>
            <Menu.Item><Link to="/product-list">Products</Link></Menu.Item>
        </Menu>
    </Header>
    );
  }
  
  export default AdminHeader;