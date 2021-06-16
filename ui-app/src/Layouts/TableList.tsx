import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';

const { Header, Content, Sider } = Layout;

const TableListLayout: FC = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout>
      <AdminHeader />
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/product-list">Products</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed)
        })}
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <Sider
            className="site-layout-background"
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
              <Menu.SubMenu key="sub1" title="subnav 1">
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{props.children}</Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TableListLayout;
