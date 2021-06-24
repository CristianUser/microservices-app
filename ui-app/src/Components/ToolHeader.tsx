import React, { FC } from 'react';
import { Layout, Menu, PageHeader, PageHeaderProps } from 'antd';
import { Link } from 'react-router-dom';
const { Header } = Layout;

type BreadcrumbRoute = {
    path: string,
    breadcrumbName: string
}
type Props = {
    children?: React.ReactNode,
    breadcrumbRoutes?: Array<BreadcrumbRoute>,
    header: PageHeaderProps
}
export const ToolHeader: FC<Props> = (props: Props) => {
    return (
        <PageHeader
            breadcrumb={{ itemRender: route => (<Link to={route.path}>{route.breadcrumbName}</Link>), routes: props.breadcrumbRoutes }}
            ghost={false}
            {...props.header}
        />
    );
}

export default ToolHeader;
