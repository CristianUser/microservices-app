/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../Layouts/EditPage';
import PreviewAndUpload from '../Components/PreviewAndUpload';
import CrudClient from '../Services/CrudClient';
import { ItemGroup } from '../Utils/interfaces';
import JsonForm from '../Components/JsonForm';

const itemGroupClient = new CrudClient<ItemGroup>({ routePrefix: '/item/group' });
const PageContext = React.createContext({});

const SiderContent: FC = (): React.ReactElement => {
  const { data, setData }: any = useContext(PageContext);

  return (
    <>
      <PreviewAndUpload
        imageUrl={data.imageUrl}
        uploadOptions={{ path: '/item-group/' }}
        onComplete={(response, imageUrl) => {
          setData({ ...data, imageUrl });
        }}
      />
    </>
  );
};

const ItemGroupPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<ItemGroup>({});
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/item-groups',
      breadcrumbName: 'Item Groups'
    },
    {
      path: `/item-group/${id}`,
      breadcrumbName: data?.name || 'Group'
    }
  ];
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      disabled: {
        type: 'boolean'
      },
      description: {
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
                type: 'Control',
                scope: '#/properties/name'
              },
              {
                type: 'Control',
                scope: '#/properties/disabled'
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
            scope: '#/properties/description',
            options: {
              multi: true
            }
          }
        ]
      }
    ]
  };

  const onSave = async () => {
    try {
      const result = await itemGroupClient.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', result.id || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      itemGroupClient
        .getDoc(id)
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, []);

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
            onChange={(form: any) => {
              setData(form.data);
            }}
          />
        )}
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default ItemGroupPage;
