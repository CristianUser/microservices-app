import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Descriptions, Image, Row, Table, Typography } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';
import { Customer, PricedItem } from '../../../Utils/interfaces';
import BasicClient from '../../../Services/BasicClient';

const customerClient = new BasicClient<Customer>({ routePrefix: '/selling/customer' });

export type PosSaleProps = {
  id: string;
  items: PricedItem[];
  customer: string;
  details: SaleDetail[];
  onChange: (key: string, data: SaleDetail[]) => void;
  onSubmit?: (key: string, data: any) => void;
};

export type SaleDetail = {
  item: string;
  itemName: string;
  qty: number;
  price: number;
};

const PosSale: FC<PosSaleProps> = (props: PosSaleProps) => {
  const { id, items, customer, onChange, onSubmit, details: dataDetails } = props;
  const [details, setDetails] = useState<SaleDetail[]>([]);
  const [customerData, setCustomerData] = useState<Customer>({});
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

  const onChangeItemQty = (item: SaleDetail, qty: number) => {
    const newDetails = [...details];
    const idx = details.findIndex((detail) => detail.item === item.item);

    newDetails[idx].qty += qty;
    if ((newDetails[idx].qty <= 1 && qty === -1) || qty === 0) {
      newDetails.splice(idx, 1);
    }
    setDetails(newDetails);
  };

  const onSubmitSale = () => {
    onSubmit?.(id, {
      customer,
      items: details,
      subTotal: total,
      total,
      status: 'active'
    });
  };

  const detailsColumns: ColumnType<SaleDetail>[] = [
    { dataIndex: 'itemName', title: 'Item' },
    { dataIndex: 'qty', title: 'QTY' },
    { dataIndex: 'price', title: 'Price' },
    {
      dataIndex: 'total',
      title: 'Sub-Total',
      render(text: string, item) {
        return (item.qty * item.price).toFixed(2);
      }
    },
    {
      dataIndex: 'id',
      title: '',
      render(text: string, item) {
        return (
          <>
            <Button size="small" icon={<PlusOutlined />} onClick={() => onChangeItemQty(item, 1)} />
            <Button
              size="small"
              icon={<MinusOutlined />}
              onClick={() => onChangeItemQty(item, -1)}
            />
            <Button
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onChangeItemQty(item, 0)}
            />
          </>
        );
      }
    }
  ];

  useEffect(() => {
    onChange(id, details);
  }, [details]);

  useEffect(() => {
    if (dataDetails?.length) {
      setDetails(dataDetails);
    }
  }, [dataDetails]);

  useEffect(() => {
    if (customer) {
      customerClient.getDoc(customer).then(setCustomerData);
    }
  }, [customer]);

  const renderFooter = () =>
    details.length ? (
      <>
        <Descriptions title="Summary" layout="horizontal" labelStyle={{ fontWeight: 'bold' }}>
          <Descriptions.Item span={2} label="Customer">
            {customerData.name}
          </Descriptions.Item>
          <Descriptions.Item label="Total">{total.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Sub-Total">{total.toFixed(2)}</Descriptions.Item>
        </Descriptions>
        <Button onClick={onSubmitSale}>Submit</Button>
      </>
    ) : null;

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Sale">
          <Table
            rowKey="item"
            columns={detailsColumns}
            dataSource={details}
            footer={renderFooter}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Items" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            {items.map((item) => (
              <Col key={item.id} span={6} onClick={() => onClickItem(item)}>
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

export default PosSale;
