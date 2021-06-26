/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Layout } from 'antd';
import { SiderProps } from 'antd/lib/layout';

const { Sider } = Layout;

const CommonSider: FC<SiderProps> = (props: SiderProps) => {
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
};

export default CommonSider;
