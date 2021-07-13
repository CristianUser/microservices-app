/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import itemClient from '../../Services/Item';
import BasicClient from '../../Services/BasicClient';
import { ItemGroup, ItemPrice } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';
import PageContext from '../../Contexts/PageContext';

const itemPriceClient = new BasicClient<any>({ routePrefix: '/item/price' });

const SiderContent: FC = (): React.ReactElement => {
  return <></>;
};

const ItemPricePage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<ItemPrice>({});
  const [items, setItems] = useState<ItemGroup[]>([]);
  const [mappedItems, setMappedItems] = useState<any[]>([{ const: 0, title: '' }]);
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/item-prices',
      breadcrumbName: 'Item Prices'
    },
    {
      path: `/item-price/${id}`,
      breadcrumbName: data?.item?.name || 'Price'
    }
  ];

  const schema = {
    type: 'object',
    properties: {
      currency: {
        type: 'string',
        minLength: 1,
        maxLength: 3
      },
      rate: {
        type: 'number'
      },
      disabled: {
        type: 'boolean'
      },
      buying: {
        type: 'boolean'
      },
      selling: {
        type: 'boolean'
      },
      item: {
        type: 'number',
        oneOf: mappedItems
      }
    },
    required: ['name']
  };
  const uiSchema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Group',
        label: 'Price List',
        elements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/item',
                    label: 'Item'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/currency'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/rate'
                  }
                ]
              },
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/disabled'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/buying'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/selling'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await itemClient.getDocs().then(({ rows }) => setItems(rows));

      if (id !== 'new') {
        await itemPriceClient.getDoc(id).then(setData);
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
    setMappedItems(
      items.map((row) => ({
        title: row.name || '',
        const: row.id || ''
      }))
    );
  }, [items]);

  const onSave = async () => {
    try {
      const result = await itemPriceClient.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', result.id || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  return (
    <PageContext.Provider value={{ data, setData }}>
      <EditPageLayout left={<SiderContent />} breadcrumbRoutes={routes} onSave={onSave}>
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

export default ItemPricePage;
