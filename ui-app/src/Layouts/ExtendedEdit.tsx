/* eslint-disable react/require-default-props */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import AdminHeader from '../Components/AdminHeader';
import CommonSider from '../Components/CommonSider';
import ToolHeader from '../Components/ToolHeader';
import LayoutContext from '../Contexts/LayoutContext';
import PageContext from '../Contexts/PageContext';

const { Content } = Layout;

type BreadcrumbRoute = {
  path: string;
  breadcrumbName: string;
};
type ExtendedEditLayoutProps = {
  title?: string;
  subTitle?: any;
  tags?: React.ReactElement;
  left?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbRoutes?: Array<BreadcrumbRoute>;
  actions?: React.ReactNode;
  headerContent?: React.ReactNode;
};

const ExtendedEditLayout: FC<ExtendedEditLayoutProps> = (props: ExtendedEditLayoutProps) => {
  const { data, setData, initialData } = useContext(PageContext);
  const [collapsed, setCollapsed] = useState(false);
  const { breadcrumbRoutes, children, left, title, subTitle, tags, actions, headerContent } = props;

  useEffect(() => {
    setData?.(data);
  }, [initialData]);

  return (
    <Layout>
      <LayoutContext.Provider value={{}}>
        <AdminHeader />
        <ToolHeader
          breadcrumbRoutes={breadcrumbRoutes}
          header={{
            backIcon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
            onBack: () => setCollapsed(!collapsed),
            title,
            subTitle,
            tags,
            extra: actions
          }}
        >
          {headerContent}
        </ToolHeader>
        <Content style={{ padding: '0 24px' }}>
          <Layout className="" style={{ padding: '24px 0' }}>
            {left && <CommonSider collapsed={collapsed}> {left} </CommonSider>}
            <Content style={{ padding: '0 24px', minHeight: 280 }}>{children}</Content>
          </Layout>
        </Content>
      </LayoutContext.Provider>
    </Layout>
  );
};

export default ExtendedEditLayout;
