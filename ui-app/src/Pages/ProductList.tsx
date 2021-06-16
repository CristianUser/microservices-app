import React, { FC } from 'react';
import { Button, Table } from 'antd';
import TableListLayout from '../Layouts/TableList';

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'age',
    },
    {
      title: 'ID',
      dataIndex: 'address',
    },
  ];
  
  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
  
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  // rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  
const ProductListPage: FC = () =>{
    return (
      <TableListLayout>
        <Table
            rowSelection={{
            type: 'checkbox',
            ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
        />
      </TableListLayout>
    );
  }
  
  export default ProductListPage;