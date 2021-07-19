/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import EditPageLayout from '../../Layouts/EditPage';
import itemClient from '../../Services/Item';
import BasicClient from '../../Services/BasicClient';
import { ItemPrice, Order, PricedItem } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';
import PageContext from '../../Contexts/PageContext';
import FormClient from '../../Services/FormClient';

const formClient = new FormClient();
const sellingClient = new BasicClient<Order>({ routePrefix: '/selling/order' });
const itemPriceClient = new BasicClient<ItemPrice>({ routePrefix: '/item/price' });

const SaleOrderPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Order>({ items: [], subTotal: 0, total: 0 });
  const [initialData, setInitialData] = useState<any>({ items: [], subTotal: 0, total: 0 });
  const [items, setItems] = useState<PricedItem[]>([]);
  const [schema, setSchema] = useState({});
  const [newPriceQueue, setNewPriceQueue] = useState<string[]>([]);
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
      await itemClient.getPricedItems().then((rows) => setItems(rows));
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
      const priceKey = ['items', itemIdx, 'price'];
      if (!_.get(data, priceKey)) {
        const itemData = items.find((item) => item.id === itemSelected.item);

        _.set(data, priceKey, itemData?.price || 0);
        if (!itemData?.price && itemSelected.item) {
          setNewPriceQueue(_.uniq(newPriceQueue.concat([itemSelected.item])));
        }
      }

      data.subTotal += _.get(data, priceKey) * itemSelected.qty;
    });
    data.total = data.subTotal;
    setData(data);
  }, [data.items]);

  const onSave = async () => {
    try {
      await Promise.all(
        newPriceQueue.map((itemId) => {
          const item = data.items.find((orderItem) => orderItem.item === itemId);

          return itemPriceClient.createDoc({
            item: itemId,
            rate: item.price,
            currency: 'USD'
          });
        })
      );
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
