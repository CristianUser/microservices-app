/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { Card, message, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

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
    try {
      const { id: newId } = await sessionClient.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  const onClickTable = (table: any) => {
    const newPane = {
      key: table.id,
      title: _.get(table, 'style.label.value'),
      data: { items, customer: _.get(table, 'data.customer'), details: [] }
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

  const onSubmitSale = (key: string, order: Order) => {
    sellingClient.createDoc({ ...order, session: id }).then(() => {
      message.success('Order Completed');
      tabRef.removePane(key);
      onSave();
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.data?.panes) {
      setPanes(data.data?.panes);
      if (data.data?.panes.length) {
        const [firstPane] = data.data?.panes;

        tabRef.select(firstPane.key);
      }
    }
  }, [data]);

  useEffect(() => {
    setData({ ...data, data: { panes } });
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
        </Space>
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default PosSessionPage;
