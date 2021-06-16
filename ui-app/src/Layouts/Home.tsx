import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import PublicHeader from '../Components/PublicHeader';

const { Header, Footer, Content } = Layout;

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