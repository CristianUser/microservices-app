/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, message, Space, Statistic, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import { ColumnType } from 'antd/lib/table';
import { format } from 'date-fns';
import ExtendedEditLayout from '../../../Layouts/ExtendedEdit';
import PageContext from '../../../Contexts/PageContext';
import BasicClient from '../../../Services/BasicClient';
import PosLayout from '../../../Components/PosLayoutEditor/PosLayout';
import Tabulator, { Pane, useTab } from '../../../Components/Tabulator';
import { Order, PosSession, PricedItem } from '../../../Utils/interfaces';
import itemClient from '../../../Services/Item';
import PosSale, { PosSaleProps, SaleDetail } from './PosSale';
import TimeCounter from '../../../Components/TimeCounter';

const sessionClient = new BasicClient<PosSession>({ routePrefix: '/selling/pos-session' });
const sellingClient = new BasicClient<Order>({ routePrefix: '/selling/order' });
const employeeClient = new BasicClient<any>({ routePrefix: '/hr/employee' });

function withProps<T>(Component: FC<T>, props: T & any): FC<T> {
  return (extraProps: T) => <Component {...props} {...extraProps} />;
}

const salesColumns: ColumnType<Order>[] = [
  { dataIndex: 'cid', title: 'ID' },
  { dataIndex: 'total', title: 'Total', render: (value: number) => `$${value.toFixed(2)}` },
  {
    dataIndex: 'createdAt',
    title: 'Date',
    render: (value: string) => format(new Date(value), 'yyyy/MM/dd HH:mm')
  }
];

const expandedRowRender = (record: Order) => {
  const columns = [
    { dataIndex: 'itemName', title: 'Item' },
    { dataIndex: 'qty', title: 'QTY' },
    { dataIndex: 'price', title: 'Price' }
  ];
  return <Table columns={columns} dataSource={record.items} pagination={false} rowKey="item" />;
};

const PosSessionPage: FC = () => {
  const tabRef = useTab();
  const { id } = useParams<any>();
  const history = useHistory();
  const [data, setData] = useState<PosSession>({});
  const [employee, setEmployee] = useState<any>();
  const [items, setItems] = useState<PricedItem[]>([]);
  const [panes, setPanes] = useState<Pane[]>([]);
  const [loading, setLoading] = useState(false);
  const hasSubmittedSale = useRef(false);
  const editable = data.status === 'draft';
  const totalSold = useMemo(
    () =>
      data.orders?.reduce((total, order) => {
        total += order.total;
        return total;
      }, 0) || 0,
    [data.orders]
  );
  const status = useMemo(() => {
    const statusMap: any = {
      draft: 'In Progress',
      active: 'Completed'
    };

    return statusMap[data.status || 'draft'];
  }, [data.status]);

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

  const saveSession = async () => {
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

  const onFinish = async () => {
    setLoading(true);

    try {
      const newData = _.omit({ ...data, data: {}, status: 'active', endDate: new Date() }, [
        'orders'
      ]);

      await sessionClient.save(id, newData).then(setData);
      message.success('Saved successfully!');
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
      await sellingClient.createDoc({ ...order, session: id });
      tabRef.removePane(key);
      message.success('Order Completed');
      hasSubmittedSale.current = true;
      await fetchData();
    } catch (error) {
      message.error('Error submitting sale');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!employee && data.employee) {
      employeeClient.getDoc(data.employee).then(setEmployee);
    }

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
    if (hasSubmittedSale.current) {
      saveSession();
      hasSubmittedSale.current = false;
    }
  }, [panes]);

  return (
    <PageContext.Provider value={{ data, setData }}>
      <ExtendedEditLayout
        title="Pos Session"
        breadcrumbRoutes={routes}
        actions={
          editable && (
            <>
              <Button key="btn-1" onClick={saveSession}>
                Save
              </Button>
              <Button key="btn-2" onClick={onFinish}>
                Finish
              </Button>
            </>
          )
        }
        headerContent={
          <Space>
            <Statistic title="Status" value={status} />
            <TimeCounter
              title="Time"
              startTime={data.createdAt?.toString()}
              endTime={data.endDate?.toString()}
            />
            <Statistic
              title="Sold"
              prefix="$"
              value={totalSold}
              precision={2}
              style={{
                margin: '0 32px'
              }}
            />
            <Statistic title="Employee" value={employee?.name} />
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {editable && (
            <>
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
            </>
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
      </ExtendedEditLayout>
    </PageContext.Provider>
  );
};

export default PosSessionPage;
