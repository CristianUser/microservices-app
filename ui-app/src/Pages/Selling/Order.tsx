/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
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

const SaleOrderPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Order>({ items: [], subTotal: 0, total: 0 });
  const [initialData, setInitialData] = useState<any>({ items: [], subTotal: 0, total: 0 });
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
      breadcrumbName: 'Order'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema('selling/order/schema.json').then(setSchema);
      await formClient.getSchema('selling/order/uischema.json').then(setUiSchema);
      await itemClient.getDocs({ populate: true }).then(({ rows }) => setItems(rows));
      if (id !== 'new') {
        await sellingClient.getDoc(id).then((doc) => {
          setData(doc);
          setInitialData(doc);
        });
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
    data.subTotal = 0;
    data.items.forEach((itemSelected, itemIdx) => {
      const itemData = items.find((item) => item.id === itemSelected.item);

      if (!data.items[itemIdx].price) {
        data.items[itemIdx].price = itemData?.prices[0]?.rate || 0;
      }

      data.subTotal += data.items[itemIdx].price * itemSelected.qty;
    });
    data.total = data.subTotal;
    setData(data);
  }, [data.items]);

  const onSave = async () => {
    try {
      const { status, id: newId } = await sellingClient.save(id, data);

      setInitialData({ ...data, status });
      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  return (
    <PageContext.Provider value={{ data, setData, initialData, setInitialData }}>
      <EditPageLayout breadcrumbRoutes={routes} title="Sale Order" onSave={onSave}>
        <JsonForm
          loading={loading}
          uiSchema={uiSchema}
          schema={schema}
          data={data}
          onChange={(form) => {
            setData(form.data);
          }}
        />
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default SaleOrderPage;
