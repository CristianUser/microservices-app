/* eslint-disable react/require-default-props */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import _ from 'lodash';

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
type EditPageLayoutProps = {
  title?: string;
  subTitle?: any;
  tags?: React.ReactElement;
  left?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbRoutes?: Array<BreadcrumbRoute>;
  onSave?: <T = any>(a?: T) => void;
  onDiscard?: <T = any>(a?: T) => void;
};

const EditPageLayout: FC<EditPageLayoutProps> = (props: EditPageLayoutProps) => {
  const { data, setData, initialData } = useContext(PageContext);
  const [collapsed, setCollapsed] = useState(false);
  const { breadcrumbRoutes, children, left, title, subTitle, tags } = props;
  const isDraft = data?.status === 'draft';
  const isDirty = !_.isEqual(JSON.stringify(data), JSON.stringify(initialData));

  const discardChanges = () => {
    setData?.(initialData);
    props.onDiscard?.();
  };
  const validateDoc = () => {
    data.status = 'active';
    setData?.(data);
    props.onSave?.();
  };

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
            extra: (
              <>
                <Button key="2" onClick={discardChanges} disabled={!isDirty}>
                  Discard
                </Button>
                {isDraft && !isDirty ? (
                  <Button key="1" type="primary" onClick={validateDoc}>
                    Confirm
                  </Button>
                ) : (
                  <Button key="1" type="primary" onClick={() => props.onSave?.()}>
                    Save
                  </Button>
                )}
              </>
            )
          }}
        />
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

export default EditPageLayout;
