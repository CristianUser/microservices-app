import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, PageHeader, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';

const { Content, Sider } = Layout;

type Props = {
  left?: React.ReactNode,
  children?: React.ReactNode
}
const routes = [
  {
    path: '/',
    breadcrumbName: 'Home',
  },
  {
    path: '/product-list',
    breadcrumbName: 'Items',
  },
  {
    path: '/item/id',
    breadcrumbName: 'Item Name',
  },
];

const EditPageLayout: FC<Props> = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <AdminHeader />
        <PageHeader
          breadcrumb={{ routes }}
          ghost={false}
          backIcon={collapsed ? <MenuUnfoldOutlined/> :<MenuFoldOutlined />}
          onBack={() => setCollapsed(!collapsed)}
          title="Title"
          subTitle="This is a subtitle"
          extra={[
            <Button key="2">Discard</Button>,
            <Button key="1" type="primary">
              Save
            </Button>,
          ]}
        >
        </PageHeader>
      <Content style={{ padding: '0 50px' }}>
        <Layout className="" style={{ padding: '24px 0' }}>
          <Sider
            style={{ background: '#fff' }}
            className="gray-2"
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

export default EditPageLayout;
