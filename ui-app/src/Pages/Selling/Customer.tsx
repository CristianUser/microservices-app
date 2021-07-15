/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import BasicClient from '../../Services/BasicClient';
import { Customer } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';
import PageContext from '../../Contexts/PageContext';

const sellingClient = new BasicClient<Customer>({ routePrefix: '/selling/customer' });

const SiderContent: FC = (): React.ReactElement => {
  return <></>;
};

const CustomerPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Customer>({ name: '' });
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/customers',
      breadcrumbName: 'Customers'
    },
    {
      path: `/customer/${id}`,
      breadcrumbName: data?.name || 'Customer'
    }
  ];
  const schema = {
    type: 'object',
    properties: {
      disabled: {
        type: 'boolean'
      },
      name: {
        type: 'string'
      }
    },
    required: ['name']
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
                    scope: '#/properties/name'
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
        title="Customer"
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

export default CustomerPage;
