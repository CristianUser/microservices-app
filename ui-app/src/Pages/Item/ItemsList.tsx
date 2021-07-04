import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import TableListLayout from '../../Layouts/TableList';
import itemClient from '../../Services/Item';

const columns: ColumnsType<any> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text: string, data: any) => <Link to={`/item/${data.id}`}>{text}</Link>
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

const ItemListPage: FC = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    itemClient.getDocs().then((data) => {
      setRows(data.rows);
    });
  }, []);
  return (
    <TableListLayout title="Items" toNewDoc="/item/new">
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

export default ItemListPage;
