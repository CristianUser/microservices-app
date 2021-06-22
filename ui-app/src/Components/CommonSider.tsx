import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { SiderProps } from 'antd/lib/layout';
const { Sider } = Layout;

const CommonSider: FC<SiderProps>= (props: SiderProps) =>{
    return (
      <Sider
      style={{ background: '#fff' }}
      className="gray-2"
      trigger={null}
      collapsible
      collapsedWidth={0}
      width={200}
      {...props}
    />
    );
  }
  
  export default CommonSider;
