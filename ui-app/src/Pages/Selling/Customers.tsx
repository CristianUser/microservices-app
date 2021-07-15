import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import TableListLayout from '../../Layouts/TableList';
import { Customer } from '../../Utils/interfaces';
import BasicClient from '../../Services/BasicClient';

const serviceClient = new BasicClient<Customer>({ routePrefix: '/selling/customer' });

const columns: ColumnsType<any> = [
  {
    title: 'Customer',
    dataIndex: 'name',
    render: (text: string, data: any) => <Link to={`/customer/${data.id}`}>{text}</Link>
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

const CustomersPage: FC = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    serviceClient.getDocs().then((data) => {
      setRows(data.rows);
    });
  }, []);
  return (
    <TableListLayout title="Customers" toNewDoc="/customer/new">
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

export default CustomersPage;
