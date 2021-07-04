/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import PreviewAndUpload from '../../Components/PreviewAndUpload';
import itemClient from '../../Services/Item';
import BasicClient from '../../Services/BasicClient';
import { Item, ItemBrand, ItemGroup } from '../../Utils/interfaces';
import JsonForm from '../../Components/JsonForm';

const itemGroupClient = new BasicClient<ItemGroup>({ routePrefix: '/item/group' });
const itemBrandClient = new BasicClient<ItemBrand>({ routePrefix: '/item/brand' });

type IPageContext = {
  data?: Item;
  setData?: React.Dispatch<any>;
  groups: ItemGroup[];
};

const PageContext = React.createContext<IPageContext>({ groups: [] });

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
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<Item>({});
  const [groups, setGroups] = useState<ItemGroup[]>([]);
  const [brands, setBrands] = useState<ItemBrand[]>([]);
  const [mappedGroups, setMappedGroups] = useState<any[]>([{ const: 0, title: '' }]);
  const [mappedBrands, setMappedBrands] = useState<any[]>([{ const: 0, title: '' }]);
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
      },
      uom: {
        type: 'string',
        enum: ['Unit', 'KG']
      },
      itemGroup: {
        type: 'number',
        oneOf: mappedGroups
      },
      brand: {
        type: 'number',
        oneOf: mappedBrands
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
      await itemGroupClient.getDocs().then(({ rows }) => setGroups(rows));
      await itemBrandClient.getDocs().then(({ rows }) => setBrands(rows));

      if (id !== 'new') {
        await itemClient.getDoc(id).then(setData);
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
    setMappedGroups(
      groups.map((row) => ({
        title: row.name || '',
        const: row.id || ''
      }))
    );
  }, [groups]);

  useEffect(() => {
    setMappedBrands(
      brands.map((row) => ({
        title: row.name || '',
        const: row.id || ''
      }))
    );
  }, [brands]);

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
    <PageContext.Provider value={{ data, setData, groups }}>
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

export default ItemPage;
