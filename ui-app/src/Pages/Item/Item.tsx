/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import PreviewAndUpload from '../../Components/PreviewAndUpload';
import itemClient from '../../Services/Item';
import { Item } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';
import PageContext from '../../Contexts/PageContext';
import LayoutContext from '../../Contexts/LayoutContext';
import FormClient from '../../Services/FormClient';

const formClient = new FormClient();

const SiderContent: FC = (): React.ReactElement => {
  const { data, setData } = useContext(PageContext);

  return (
    <>
      <PreviewAndUpload
        imageUrl={data?.imageUrl}
        uploadOptions={{ path: '/item/' }}
        onComplete={({ uri }) => {
          setData?.({ ...data, imageUrl: `http://localhost:5000/files${uri}` });
        }}
      />
    </>
  );
};

const ItemPage: FC = () => {
  const { setInitialData } = useContext(LayoutContext);
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Item>({});
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/items-list',
      breadcrumbName: 'Items'
    },
    {
      path: `/item/${id}`,
      breadcrumbName: data?.name || 'Item'
    }
  ];

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
                    scope: '#/properties/name',
                    label: 'Item Name'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/itemGroup',
                    label: 'Item Group'
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/uom',
                    label: 'Unit of Measure'
                  }
                ]
              },
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/disabled'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'Group',
        label: 'Description',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/brand',
            options: {
              trim: true
            }
          },
          {
            type: 'Control',
            scope: '#/properties/description',
            options: {
              multi: true
            }
          }
        ]
      }
    ]
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema('item/schema.json').then(setSchema);
      if (id !== 'new') {
        await itemClient.getDoc(id).then((response) => {
          setData(response);
          setInitialData?.(response);
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

  const onSave = async () => {
    try {
      const result = await itemClient.save(id, data);

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
        title={data?.name || 'Item'}
        subTitle={data?.status}
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

export default ItemPage;
