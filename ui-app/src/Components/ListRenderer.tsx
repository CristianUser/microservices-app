/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Table, TablePaginationConfig, Typography } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { SorterResult } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';

import BasicClient from '../Services/BasicClient';
import TableListLayout from '../Layouts/TableList';
import { JsonListProps } from '../Utils/interfaces';
import { resolvePath } from '../Utils/json-renderers';
import StatusTag from './StatusTag';
import FormModal from './FormModal';

const { Text } = Typography;

type FiltersRendererProps = {
  onChange: (value: any) => void;
};

interface JsonListPropsExtended extends JsonListProps {
  searchableColumns: string[];
}

function onlyTruthyValues(input: Record<string, any>) {
  return Object.entries<any>(input).reduce((prev: any, [key, value]) => {
    if (Array.isArray(value) ? value.length : value) {
      prev[key] = value;
    }
    return prev;
  }, {});
}

function buildColumns(columns: any[], getSearchPropsFor?: Function) {
  return columns.map((column: any) => {
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
    if (column.searchable) {
      column = {
        ...column,
        ...getSearchPropsFor?.(column.dataIndex)
      };
    }

    return column;
  });
}

const withComplexColumns =
  (Component: FC<JsonListProps>): FC<JsonListPropsExtended> =>
  (props: JsonListProps) => {
    const searchableColumns: string[] = [];
    const getColumnSearchProps = (dataIndex: string) => {
      let searchInput: any;

      searchableColumns.push(dataIndex);
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => confirm({ closeDropdown: false })}>
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : '' }} />
        ),
        onFilterDropdownVisibleChange: (visible: boolean) => {
          if (visible) {
            setTimeout(() => searchInput.select(), 100);
          }
        }
      };
    };

    const resolvedColumns = buildColumns(props.columns, getColumnSearchProps);

    return <Component {...props} columns={resolvedColumns} searchableColumns={searchableColumns} />;
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
  const {
    apiRoutePrefix,
    breadcrumbRoutes,
    callArgs,
    collapsedSidebar,
    columns,
    searchableColumns,
    title,
    toNewDoc
  } = props;

  const client = new BasicClient<any>({ routePrefix: apiRoutePrefix });
  const history = useHistory();
  const [rows, setRows] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [matchFilters, setMatchFilters] = useState<Record<string, any | any[]>>({});
  const [searchFilters, setSearchFilters] = useState<Record<string, any | any[]>>({});
  const [sort, setSort] = useState<any>({ createdAt: 'ASC' });

  useEffect(() => {
    setLoading(true);
    client
      .getDocs({
        ...callArgs,
        search: searchFilters,
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
  }, [matchFilters, searchFilters, pagination.current, sort]);

  const onChangeFilters = (formData: Record<string, any>) => {
    setMatchFilters(onlyTruthyValues(formData));
  };

  const onNew = () => {
    if (typeof toNewDoc === 'string') {
      history.push(toNewDoc);
    } else {
      // open form dialog
      setShowForm(true);
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    const searchValues = Object.entries<string[]>(
      onlyTruthyValues(_.pick(filters, searchableColumns))
    ).reduce((prev: any, [key, value]) => {
      const [val] = value;

      prev[key] = val;
      return prev;
    }, {});
    const sorterOptions: SorterResult<any>[] = Array.isArray(sorter) ? sorter : [sorter];
    const sorting = sorterOptions.reduce((prev: any, option) => {
      if (option.field) {
        const key: any = option.field;
        const value = option.order === 'ascend' ? 'ASC' : 'DESC';

        prev[key] = value;
      }
      return prev;
    }, {});

    setSort(sorting);
    setPagination(pagination);
    onChangeFilters(_.omit(filters, searchableColumns));
    setSearchFilters(searchValues);
  };

  return (
    <TableListLayout
      startCollapsed={collapsedSidebar}
      title={title}
      onNew={onNew}
      breadcrumbRoutes={breadcrumbRoutes}
      left={<FiltersRenderer onChange={onChangeFilters} />}
    >
      <FormModal
        title={title}
        apiRoutePrefix={apiRoutePrefix}
        visible={showForm}
        toNewDoc={toNewDoc}
        onCancel={() => setShowForm(false)}
        onSave={() => setShowForm(false)}
      />
      <Table
        rowSelection={{
          type: 'checkbox'
        }}
        rowKey="id"
        pagination={pagination}
        columns={columns}
        dataSource={rows}
        loading={loading}
        onChange={handleTableChange}
      />
    </TableListLayout>
  );
};

export default withComplexColumns(ListPageRenderer);
