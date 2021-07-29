/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react';

import { Card, Col, message, Row, Space, Image, Typography, Table, Descriptions } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import EditPageLayout from '../../Layouts/EditPage';
import PageContext from '../../Contexts/PageContext';
import BasicClient from '../../Services/BasicClient';
import PosLayout from '../../Components/PosLayoutEditor/PosLayout';
import Tabulator, { useTab } from '../../Components/Tabulator';
import { PricedItem } from '../../Utils/interfaces';
import itemClient from '../../Services/Item';

const sellingClient = new BasicClient<any>({ routePrefix: '/selling/pos-session' });

type PosSaleProps = {
  items: PricedItem[];
};

type SaleDetail = {
  item: string;
  itemName: string;
  qty: number;
  price: number;
};

const detailsColumns = [
  { dataIndex: 'itemName', title: 'Item' },
  { dataIndex: 'qty', title: 'QTY' },
  { dataIndex: 'price', title: 'Price' }
];
const PosSale: FC<PosSaleProps> = (props: PosSaleProps) => {
  const { items } = props;
  const [details, setDetails] = useState<SaleDetail[]>([]);
  const total = useMemo(() => details.reduce((a, b) => a + b.price * b.qty, 0), [details]);

  const onClickItem = (item: PricedItem) => {
    const newDetails = [...details];
    const idx = details.findIndex((detail) => detail.item === item.id);

    if (idx !== -1) {
      newDetails[idx].qty += 1;
    } else {
      const newItem: SaleDetail = {
        item: item.id || '',
        itemName: item.name || '',
        qty: 1,
        price: item.price
      };

      newDetails.push(newItem);
    }
    setDetails(newDetails);
  };

  const renderFooter = () =>
    details.length ? (
      <Descriptions title="Summary">
        <Descriptions.Item label="Total">{total}</Descriptions.Item>
        <Descriptions.Item label="Sub-Total">{total}</Descriptions.Item>
      </Descriptions>
    ) : null;

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Sale">
          <Table columns={detailsColumns} dataSource={details} footer={renderFooter} />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Items">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            {items.map((item) => (
              <Col span={6} onClick={() => onClickItem(item)}>
                <Image
                  preview={false}
                  src={item.imageUrl}
                  fallback="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
                />
                <Typography.Title level={5}>{item.name}</Typography.Title>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

const PosSessionPage: FC = () => {
  const tabRef = useTab();
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [items, setItems] = useState<PricedItem[]>([]);
  const [panes, setPanes] = useState<any>([]);
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
      await sellingClient.getDoc(id, { populate: true }).then(setData);
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  const onSave = async () => {
    try {
      const { id: newId } = await sellingClient.save(id, data);

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
      data: { items }
    };

    if (tabRef.getPane(newPane.key)) {
      tabRef.select(newPane.key);
    } else {
      tabRef.addPane(newPane);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const withProps = (Component: FC<any>, props: any): FC<any> => {
    return () => <Component {...props} />;
  };

  return (
    <PageContext.Provider value={{ data, setData }}>
      <EditPageLayout title="Pos Session" onSave={onSave} breadcrumbRoutes={routes}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card loading={loading}>
            <Tabulator
              tab={tabRef}
              data={panes}
              onChange={setPanes}
              content={withProps(PosSale, { items })}
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
