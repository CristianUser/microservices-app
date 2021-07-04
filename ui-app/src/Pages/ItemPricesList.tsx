import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import TableListLayout from '../Layouts/TableList';
import CrudClient from '../Services/CrudClient';

const itemClient = new CrudClient<any>({ routePrefix: '/item/price' });
const columns: ColumnsType<any> = [
  {
    title: 'Item',
    dataIndex: 'item',
    render: (text: string, data: any) => <Link to={`/item-price/${data.id}`}>{text}</Link>
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

const ItemPricesListPage: FC = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    itemClient.getDocs().then((data) => {
      setRows(data.rows);
    });
  }, []);
  return (
    <TableListLayout title="Item Prices" toNewDoc="/item-price/new">
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

export default ItemPricesListPage;
