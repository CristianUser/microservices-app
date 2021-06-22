import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';

const { Header, Content, Sider } = Layout;
type Props = {
  left?: React.ReactNode,
  children?: React.ReactNode
}

const TableListLayout: FC<Props> = (props: Props) => {
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
            <Link to="/items-list">Items</Link>
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
            {props.left}
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{props.children}</Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TableListLayout;
