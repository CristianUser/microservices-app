/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import BasicClient from '../Services/BasicClient';
import { JsonListProps } from '../Utils/interfaces';
import TableListLayout from '../Layouts/TableList';
import { resolvePath } from '../Utils/json-renderers';
import StatusTag from './StatusTag';

const ListPageRenderer: FC<JsonListProps> = (props: JsonListProps) => {
  const { apiRoutePrefix, title, breadcrumbRoutes, columns, toNewDoc } = props;

  const client = new BasicClient<any>({ routePrefix: apiRoutePrefix });
  const [rows, setRows] = useState<any[]>([]);
  const resolvedColumns = columns.map((column: any) => {
    if (column.dataIndex === 'status') {
      column.render = (text: string) => <StatusTag status={text} />;
    }
    if (column.render) {
      const { type, to } = column.render;

      if (type === 'link') {
        column.render = (text: string, data: any) => <Link to={resolvePath(to, data)}>{text}</Link>;
      }
    }
    return column;
  });

  useEffect(() => {
    client.getDocs().then((data) => {
      setRows(data.rows);
    });
  }, []);

  return (
    <TableListLayout title={title} toNewDoc={toNewDoc} breadcrumbRoutes={breadcrumbRoutes}>
      <Table
        rowSelection={{
          type: 'checkbox'
        }}
        rowKey="id"
        columns={resolvedColumns}
        dataSource={rows}
      />
    </TableListLayout>
  );
};

export default ListPageRenderer;
