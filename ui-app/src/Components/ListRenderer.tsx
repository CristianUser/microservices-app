/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useState } from 'react';
import { Form, Select, Table, TablePaginationConfig, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { SorterResult } from 'antd/lib/table/interface';
import BasicClient from '../Services/BasicClient';
import { JsonListProps } from '../Utils/interfaces';
import TableListLayout from '../Layouts/TableList';
import { resolvePath } from '../Utils/json-renderers';
import StatusTag from './StatusTag';

const { Text } = Typography;

type FiltersRendererProps = {
  onChange: (value: any) => void;
};

const FiltersRenderer: FC<FiltersRendererProps> = (props: FiltersRendererProps) => {
  const { onChange } = props;
  const [form] = Form.useForm();

  return (
    <Form form={form} onValuesChange={onChange} style={{ padding: 10 }}>
      <Text strong style={{ display: 'block', marginBottom: 5 }}>
        Filter By
      </Text>
      <Form.Item name="status">
        <Select placeholder="Status" mode="multiple">
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="archived">Archived</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

const ListPageRenderer: FC<JsonListProps> = (props: JsonListProps) => {
  const { apiRoutePrefix, title, breadcrumbRoutes, columns, toNewDoc, callArgs } = props;

  const client = new BasicClient<any>({ routePrefix: apiRoutePrefix });
  const [rows, setRows] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [matchFilters, setMatchFilters] = useState<any>({});
  const [sort, setSort] = useState<any>({});
  const resolvedColumns = columns.map((column: any) => {
    column.sortDirections = ['ASC', 'DESC'];
    if (column.dataIndex === 'status') {
      column.render = (text: string) => <StatusTag status={text} />;
    }
    if (column.render) {
      const { type, to, format: dateFormat } = column.render;

      if (type === 'link') {
        column.render = (text: string, data: any) => <Link to={resolvePath(to, data)}>{text}</Link>;
      }

      if (type === 'date') {
        column.render = (text: string) => <Text>{format(new Date(text), dateFormat)}</Text>;
      }
    }
    return column;
  });

  useEffect(() => {
    setLoading(true);
    client
      .getDocs({
        ...callArgs,
        match: matchFilters,
        sortBy: sort,
        limit: pagination.pageSize,
        page: pagination.current
      })
      .then((data) => {
        setRows(data.rows);
        setPagination({
          ...pagination,
          total: data.count
        });
      })
      .finally(() => setLoading(false));
  }, [matchFilters, pagination.current, sort]);

  const onChangeFilters = (formData: any) => {
    const filteredData = Object.entries<any>(formData).reduce((prev: any, [key, value]) => {
      if (Array.isArray(value) ? value.length : value) {
        prev[key] = value;
      }
      return prev;
    }, {});

    setMatchFilters(filteredData);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    const sorterOptions: SorterResult<any>[] = Array.isArray(sorter) ? sorter : [sorter];
    const sorting = sorterOptions.reduce((prev: any, option) => {
      if (option.field) {
        const key: any = option.field;

        prev[key] = option.order;
      }
      return prev;
    }, {});
    setSort(sorting);
    setPagination(pagination);
    onChangeFilters(filters);
  };

  return (
    <TableListLayout
      title={title}
      toNewDoc={toNewDoc}
      breadcrumbRoutes={breadcrumbRoutes}
      left={<FiltersRenderer onChange={onChangeFilters} />}
    >
      <Table
        rowSelection={{
          type: 'checkbox'
        }}
        rowKey="id"
        pagination={pagination}
        columns={resolvedColumns}
        dataSource={rows}
        loading={loading}
        onChange={handleTableChange}
      />
    </TableListLayout>
  );
};

export default ListPageRenderer;
