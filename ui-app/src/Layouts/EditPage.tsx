/* eslint-disable react/require-default-props */
/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AdminHeader from '../Components/AdminHeader';
import CommonSider from '../Components/CommonSider';
import ToolHeader from '../Components/ToolHeader';
import LayoutContext from '../Contexts/LayoutContext';

const { Content } = Layout;

type BreadcrumbRoute = {
  path: string;
  breadcrumbName: string;
};
type Props = {
  left?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbRoutes?: Array<BreadcrumbRoute>;
  onSave?: <T = any>(a?: T) => void;
};

const EditPageLayout: FC<Props> = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const layoutProps = {
    title: '',
    subTitle: ''
  };
  const { breadcrumbRoutes, children, left } = props;

  return (
    <Layout>
      <LayoutContext.Provider value={layoutProps}>
        <AdminHeader />
        <ToolHeader
          breadcrumbRoutes={breadcrumbRoutes}
          header={{
            backIcon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
            onBack: () => setCollapsed(!collapsed),
            title: layoutProps.title,
            subTitle: layoutProps.subTitle,
            extra: [
              <Button key="2">Discard</Button>,
              <Button key="1" type="primary" onClick={() => props.onSave?.()}>
                Save
              </Button>
            ]
          }}
        />
        <Content style={{ padding: '0 50px' }}>
          <Layout className="" style={{ padding: '24px 0' }}>
            <CommonSider collapsed={collapsed}> {left} </CommonSider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>{children}</Content>
          </Layout>
        </Content>
      </LayoutContext.Provider>
    </Layout>
  );
};

export default EditPageLayout;
