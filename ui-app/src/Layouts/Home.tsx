import React, { FC } from 'react';
import { Layout } from 'antd';
import PublicHeader from '../Components/PublicHeader';

const { Footer, Content } = Layout;

type Props = {
  children: any;
};

const HomeLayout: FC<Props> = (props: Props) => {
  const { children } = props;

  return (
    <Layout>
      <PublicHeader />
      <Content style={{ padding: '0 50px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>ERP App ©2021 Created by Some Devs</Footer>
    </Layout>
  );
};

export default HomeLayout;
