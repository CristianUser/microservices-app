/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react';

import { Utils } from '@antv/graphin';
import { message, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import EditPageLayout from '../../Layouts/EditPage';
import PageContext from '../../Contexts/PageContext';
import PosLayoutEditor from '../../Components/PosLayoutEditor';
import FormClient from '../../Services/FormClient';
import BasicClient from '../../Services/BasicClient';
import JsonForm from '../../Components/JsonForm';

const formClient = new FormClient();
const sellingClient = new BasicClient<any>({ routePrefix: '/selling/pos-layout' });
const source = Utils.mock(2).circle().graphin();
source.edges = [];
source.nodes.forEach((node: any) => {
  node.style.keyshape = {
    size: 80
  };
  node.style.icon = {
    size: 30
  };
});

const PosEditorPage: FC = () => {
  const [graphData, setGraphData] = useState<any>(source);
  const localStorageKey = 'posLayout.formData';
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [initialData, setInitialData] = useState<any>({ data: graphData });
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const isNewDoc = useMemo(() => id === 'new', [id]);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/layouts',
      breadcrumbName: 'Pos Layouts'
    },
    {
      path: `/layout/${id}`,
      breadcrumbName: 'Pos Layout'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema('selling/pos-layout/schema.json').then(setSchema);
      await formClient.getSchema('selling/pos-layout/uischema.json').then(setUiSchema);
      if (!isNewDoc) {
        await sellingClient.getDoc(id).then((doc) => {
          setData(doc);
          setInitialData(doc);
          setGraphData(doc.data);
        });
      } else if (localStorage.getItem(localStorageKey)) {
        setData(JSON.parse(localStorage.getItem(localStorageKey) || '{}'));
      } else {
        setData({ data: source });
      }
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  const onSave = async () => {
    try {
      const { status, id: newId } = await sellingClient.save(id, data);

      setInitialData({ ...data, status });
      localStorage.removeItem(localStorageKey);
      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  const onDiscard = () => {
    localStorage.removeItem(localStorageKey);
  };

  useEffect(() => {
    setData({ ...data, data: graphData });
  }, [graphData]);

  useEffect(() => {
    if (isNewDoc && Object.keys(data).length) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContext.Provider value={{ data, setData, initialData, setInitialData }}>
      <EditPageLayout
        title="Pos Layout"
        onSave={onSave}
        onDiscard={onDiscard}
        breadcrumbRoutes={routes}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <JsonForm
            loading={loading}
            uiSchema={uiSchema}
            schema={schema}
            data={data}
            onChange={(form) => {
              setData(form.data);
            }}
          />
          <PosLayoutEditor data={graphData} onChange={setGraphData} />
        </Space>
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default PosEditorPage;
