import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, PageHeader, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';

const { Content, Sider } = Layout;

type BreadcrumbRoute = {
  path: string,
  breadcrumbName: string
}
type Props = {
  left?: React.ReactNode,
  children?: React.ReactNode,
  breadcrumbRoutes?: Array<BreadcrumbRoute>,
  onSave?: <T = any>(a?: T) => void
}

const EditPageLayout: FC<Props> = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <AdminHeader />
        <PageHeader
          breadcrumb={{ routes: props.breadcrumbRoutes }}
          ghost={false}
          backIcon={collapsed ? <MenuUnfoldOutlined/> :<MenuFoldOutlined />}
          onBack={() => setCollapsed(!collapsed)}
          title="Title"
          subTitle="This is a subtitle"
          extra={[
            <Button key="2">Discard</Button>,
            <Button key="1" type="primary" onClick={() => props.onSave?.()}>
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
