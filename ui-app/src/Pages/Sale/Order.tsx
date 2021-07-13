/* eslint-disable eqeqeq */
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

const sellingClient = new BasicClient<Order>({ routePrefix: '/selling' });

const SiderContent: FC = (): React.ReactElement => {
  return <></>;
};

const SaleOrderPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Order>({ items: [], subTotal: 0, total: 0 });
  const [items, setItems] = useState<Item[]>([]);
  const [mappedItems, setMappedItems] = useState<any[]>([{ const: 0, title: '' }]);
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
  const schema = {
    type: 'object',
    properties: {
      disabled: {
        type: 'boolean'
      },
      customer: {
        type: 'string'
      },
      subTotal: {
        type: 'number'
      },
      total: {
        type: 'number'
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            item: {
              type: 'string',
              oneOf: mappedItems
            },
            qty: {
              type: 'integer'
            },
            price: {
              type: 'number',
              readOnly: true
            }
          }
        }
      }
    },
    required: ['items', 'customer']
  };
  const uiSchema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Group',
        elements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/customer'
                  }
                ]
              },
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/subTotal',
                    options: {
                      readonly: true
                    }
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/total',
                    options: {
                      readonly: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'Group',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/items'
          }
        ]
      }
    ]
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await itemClient.getDocs({ populate: true }).then(({ rows }) => setItems(rows));

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
    data.subTotal = 0;
    data.items.forEach((itemSelected, itemIdx) => {
      const itemData = items.find((item) => item.id == itemSelected.item);
      const price = itemData?.prices[0].rate || 0;

      data.items[itemIdx].price = price;
      data.subTotal += price * itemSelected.qty;
    });
    data.total = data.subTotal;
    setData(data);
  }, [data.items]);

  useEffect(() => {
    setMappedItems(
      items.map((row) => ({
        title: row.name || '',
        const: row.id?.toString() || ''
      }))
    );
  }, [items]);

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
