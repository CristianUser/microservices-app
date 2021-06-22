import React, { FC } from 'react';
import { Layout } from 'antd';
import PublicHeader from '../Components/PublicHeader';

const { Footer, Content } = Layout;

const HomeLayout: FC = (props) =>{
    return (
    <Layout>
        <PublicHeader />
        <Content>
            {props.children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>ERP App ©2021 Created by Some Devs</Footer>
      </Layout>
    );
  }
  
  export default HomeLayout;