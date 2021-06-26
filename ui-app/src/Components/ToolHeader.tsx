/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { PageHeader, PageHeaderProps } from 'antd';
import { Link } from 'react-router-dom';

type BreadcrumbRoute = {
  path: string;
  breadcrumbName: string;
};
type Props = {
  children?: React.ReactNode;
  breadcrumbRoutes?: Array<BreadcrumbRoute>;
  header: PageHeaderProps;
};
const ToolHeader: FC<Props> = (props: Props) => {
  return (
    <PageHeader
      breadcrumb={{
        itemRender: (route) => (
          <Link key={`link_${route.path}`} to={route.path}>
            {route.breadcrumbName}
          </Link>
        ),
        routes: props.breadcrumbRoutes
      }}
      ghost={false}
      {...props.header}
    />
  );
};
export default ToolHeader;
