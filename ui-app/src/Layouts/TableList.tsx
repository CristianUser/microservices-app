import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';
import ToolHeader from '../Components/ToolHeader';

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
      <ToolHeader
        header={{
          backIcon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
          onBack: () => setCollapsed(!collapsed),
          title: "Title",
          subTitle: "This is a subtitle",
          extra: [
            <Button key="1" type="primary">
              New
            </Button>,
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
            {props.left}
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{props.children}</Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TableListLayout;
