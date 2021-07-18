/* eslint-disable react/require-default-props */
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';
import ToolHeader from '../Components/ToolHeader';
import CommonSider from '../Components/CommonSider';

const { Content } = Layout;
type Props = {
  left?: React.ReactNode;
  children?: React.ReactNode;
  title: string;
  toNewDoc: string;
  breadcrumbRoutes?: any[];
  startCollapsed?: boolean;
};

const TableListLayout: FC<Props> = (props: Props) => {
  const { children, left, title, toNewDoc, breadcrumbRoutes, startCollapsed = false } = props;
  const [collapsed, setCollapsed] = useState(startCollapsed);

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
          {left && <CommonSider collapsed={collapsed}> {left} </CommonSider>}
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{children}</Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TableListLayout;
