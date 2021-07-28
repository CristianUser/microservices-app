/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';

import { Card, message, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import EditPageLayout from '../../Layouts/EditPage';
import PageContext from '../../Contexts/PageContext';
import BasicClient from '../../Services/BasicClient';
import PosLayout from '../../Components/PosLayoutEditor/PosLayout';
import Tabulator, { useTab } from '../../Components/Tabulator';

const sellingClient = new BasicClient<any>({ routePrefix: '/selling/pos-session' });

const PosSessionPage: FC = () => {
  const tabRef = useTab();
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [panes, setPanes] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/pos-sessions',
      breadcrumbName: 'Pos Sessions'
    },
    {
      path: `/pos-session/${id}`,
      breadcrumbName: 'Pos Session'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      await sellingClient.getDoc(id, { populate: true }).then(setData);
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  const onSave = async () => {
    try {
      const { id: newId } = await sellingClient.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  const onClickTable = (table: any) => {
    const newPane = {
      key: table.id,
      title: _.get(table, 'style.label.value'),
      content: 'Content of new Tab'
    };

    if (tabRef.getPane(newPane.key)) {
      tabRef.select(newPane.key);
    } else {
      tabRef.addPane(newPane);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContext.Provider value={{ data, setData }}>
      <EditPageLayout title="Pos Session" onSave={onSave} breadcrumbRoutes={routes}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card loading={loading}>
            <Tabulator tab={tabRef} data={panes} onChange={setPanes} />
          </Card>
          {data.layout?.data?.nodes.length && (
            <PosLayout data={data.layout.data} onClickNode={onClickTable} />
          )}
        </Space>
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default PosSessionPage;
