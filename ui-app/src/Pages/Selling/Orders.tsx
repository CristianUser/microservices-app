import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import TableListLayout from '../../Layouts/TableList';
import { Order } from '../../Utils/interfaces';
import BasicClient from '../../Services/BasicClient';

const ordersClient = new BasicClient<Order>({ routePrefix: '/selling' });

const columns: ColumnsType<any> = [
  {
    title: 'Customer',
    dataIndex: 'customer',
    render: (text: string, data: any) => <Link to={`/order/${data.id}`}>{text}</Link>
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'ID',
    dataIndex: 'id'
  }
];

const SaleOrdersPage: FC = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    ordersClient.getDocs().then((data) => {
      setRows(data.rows);
    });
  }, []);
  return (
    <TableListLayout title="Orders" toNewDoc="/order/new">
      <Table
        rowSelection={{
          type: 'checkbox'
        }}
        rowKey="id"
        columns={columns}
        dataSource={rows}
      />
    </TableListLayout>
  );
};

export default SaleOrdersPage;
