/* eslint-disable react/require-default-props */
/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';
import ToolHeader from '../Components/ToolHeader';

const { Content, Sider } = Layout;
type Props = {
  left?: React.ReactNode;
  children?: React.ReactNode;
  title: string;
  toNewDoc: string;
  breadcrumbRoutes?: any[];
};

const TableListLayout: FC<Props> = (props: Props) => {
  const { children, left, title, toNewDoc, breadcrumbRoutes } = props;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <AdminHeader />
      <ToolHeader
        breadcrumbRoutes={breadcrumbRoutes}
        header={{
          backIcon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
          onBack: () => setCollapsed(!collapsed),
          title,
          extra: [
            <Link key="1" to={toNewDoc}>
              <Button type="primary">New</Button>
            </Link>
          ]
        }}
      />
      <Content style={{ padding: '0 50px' }}>
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <Sider
            className="site-layout-background"
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            width={200}
          >
            {left}
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{children}</Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TableListLayout;
