import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Footer, Content } = Layout;

const HomeLayout: FC = (props) =>{
    return (
    <Layout>
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item><Link to="/">Home</Link></Menu.Item>
            </Menu>
        </Header>
        <Content>
            {props.children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>ERP App ©2021 Created by Some Devs</Footer>
      </Layout>
    );
  }
  
  export default HomeLayout;