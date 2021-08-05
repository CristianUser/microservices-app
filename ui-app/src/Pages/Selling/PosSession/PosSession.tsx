/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { Card, message, Space, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import { ColumnType } from 'antd/lib/table';
import { format } from 'date-fns';
import EditPageLayout from '../../../Layouts/EditPage';
import PageContext from '../../../Contexts/PageContext';
import BasicClient from '../../../Services/BasicClient';
import PosLayout from '../../../Components/PosLayoutEditor/PosLayout';
import Tabulator, { Pane, useTab } from '../../../Components/Tabulator';
import { Order, PosSession, PricedItem } from '../../../Utils/interfaces';
import itemClient from '../../../Services/Item';
import PosSale, { PosSaleProps, SaleDetail } from './PosSale';

const sessionClient = new BasicClient<PosSession>({ routePrefix: '/selling/pos-session' });
const sellingClient = new BasicClient<Order>({ routePrefix: '/selling/order' });

function withProps<T>(Component: FC<T>, props: T & any): FC<T> {
  return (extraProps: T) => <Component {...props} {...extraProps} />;
}

const salesColumns: ColumnType<Order>[] = [
  { dataIndex: 'cid', title: 'ID' },
  { dataIndex: 'total', title: 'Total', render: (value: number) => `$${value.toFixed(2)}` },
  {
    dataIndex: 'createdAt',
    title: 'Date',
    render: (value: string) => format(new Date(value), 'yyyy/MM/dd')
  }
];

const expandedRowRender = (record: Order) => {
  const columns = [
    { dataIndex: 'itemName', title: 'Item' },
    { dataIndex: 'qty', title: 'QTY' },
    { dataIndex: 'price', title: 'Price' }
  ];
  return <Table columns={columns} dataSource={record.items} pagination={false} />;
};

const PosSessionPage: FC = () => {
  const tabRef = useTab();
  const { id } = useParams<any>();
  const history = useHistory();
  const [data, setData] = useState<PosSession>({});
  const [items, setItems] = useState<PricedItem[]>([]);
  const [panes, setPanes] = useState<Pane[]>([]);
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/pos-sessions',
      breadcrumbName: 'Pos Sessions'
    },
    {
      path: `/pos-session/${id}`,
      breadcrumbName: 'Pos Session'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      await itemClient.getPricedItems().then((rows) => setItems(rows));
      await sessionClient.getDoc(id, { populate: true }).then(setData);
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  const onSave = async () => {
    setLoading(true);

    try {
      const { id: newId } = await sessionClient.save(
        id,
        _.omit({ ...data, data: { panes } }, ['orders'])
      );

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
    setLoading(false);
  };

  const onClickTable = (table: any) => {
    const newPane = {
      key: table.id,
      title: _.get(table, 'style.label.value'),
      data: { customer: _.get(table, 'data.customer'), details: [] }
    };

    if (tabRef.getPane(newPane.key)) {
      tabRef.select(newPane.key);
    } else {
      tabRef.addPane(newPane);
    }
  };

  const onChangeSaleDetails = (key: string, details: SaleDetail[]) => {
    const idx = panes.findIndex((pane) => pane.key === key);

    _.set(panes[idx], 'data.details', details);

    setPanes(panes);
  };

  const onSubmitSale = async (key: string, order: Order) => {
    setLoading(true);
    try {
      sellingClient.createDoc({ ...order, session: id });
      tabRef.removePane(key);
      message.success('Order Completed');
      await onSave();
      fetchData();
    } catch (error) {
      message.error('Error submitting sale');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.data?.panes) {
      setPanes(data.data?.panes);
    }
  }, [data]);

  useEffect(() => {
    if (tabRef.currentPane === '1' && panes.length) {
      const [firstPane] = panes;

      tabRef.select(firstPane.key);
      setPanes([...panes]);
    }
  }, [panes]);

  return (
    <PageContext.Provider value={{ data, setData }}>
      <EditPageLayout title="Pos Session" onSave={onSave} breadcrumbRoutes={routes}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card loading={loading}>
            <Tabulator
              tab={tabRef}
              data={panes}
              onChange={setPanes}
              content={withProps<PosSaleProps>(PosSale, {
                items,
                onChange: onChangeSaleDetails,
                onSubmit: onSubmitSale
              })}
            />
          </Card>
          {data.layout?.data?.nodes.length && (
            <PosLayout data={data.layout.data} onClickNode={onClickTable} />
          )}
          <Card title="Sales" loading={loading}>
            <Table
              columns={salesColumns}
              dataSource={data.orders}
              rowKey="id"
              expandable={{ expandedRowRender }}
            />
          </Card>
        </Space>
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default PosSessionPage;
