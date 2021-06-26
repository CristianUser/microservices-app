import React, { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import TableListLayout from '../Layouts/TableList';
import itemClient from '../Services/Item';

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

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log('selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.disabled, // Column configuration not to be checked
    name: record.name
  })
};

const ItemListPage: FC = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    itemClient.getItems().then((data) => {
      setRows(data.rows);
    });
  }, []);
  return (
    <TableListLayout>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        rowKey="id"
        columns={columns}
        dataSource={rows}
      />
    </TableListLayout>
  );
};

export default ItemListPage;
