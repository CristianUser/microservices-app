/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import itemClient from '../../Services/Item';
import BasicClient from '../../Services/BasicClient';
import { Item, Order } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';
import PageContext from '../../Contexts/PageContext';
import FormClient from '../../Services/FormClient';

const formClient = new FormClient();
const sellingClient = new BasicClient<Order>({ routePrefix: '/selling/order' });

const SiderContent: FC = (): React.ReactElement => {
  return <></>;
};

const SaleOrderPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Order>({ subTotal: 0, total: 0 });
  const [items, setItems] = useState<Item[]>([]);
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/orders',
      breadcrumbName: 'Orders'
    },
    {
      path: `/order/${id}`,
      breadcrumbName: data?.customer || 'Order'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema('selling/order/schema.json').then(setSchema);
      await formClient.getSchema('selling/order/uischema.json').then(setUiSchema);
      await itemClient.getDocs().then(({ rows }) => setItems(rows));
      if (id !== 'new') {
        await sellingClient.getDoc(id).then(setData);
      }
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    data.items?.forEach((itemSelected) => {
      // eslint-disable-next-line eqeqeq
      const itemData = items.find((item) => item.id == itemSelected.item);

      console.log('itemData', itemData);
      data.subTotal = data.subTotal || 0;
      data.subTotal += 20 * itemSelected.qty;
    });
    data.total = data.subTotal + 1;
    setData(data);
  }, [data.items]);

  const onSave = async () => {
    try {
      const result = await sellingClient.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', result.id || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  return (
    <PageContext.Provider value={{ data, setData }}>
      <EditPageLayout
        left={<SiderContent />}
        breadcrumbRoutes={routes}
        title="Sale Order"
        onSave={onSave}
      >
        {loading ? (
          <Card style={{ width: '100%' }} loading={loading} />
        ) : (
          <JsonForm
            uiSchema={uiSchema}
            schema={schema}
            data={data}
            onChange={(form) => {
              setData(form.data);
            }}
          />
        )}
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default SaleOrderPage;
