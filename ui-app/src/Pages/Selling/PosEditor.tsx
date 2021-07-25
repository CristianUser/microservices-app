/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';

import { Utils } from '@antv/graphin';
import { Card, Col, Row, Space } from 'antd';
import EditPageLayout from '../../Layouts/EditPage';
import PageContext from '../../Contexts/PageContext';
import PosLayoutEditor from '../../Components/PosLayoutEditor';

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
  const [graphData, setGraphData] = useState<any>({ nodes: [] });
  const localStorageKey = 'posLayout.formData';

  const fetchData = () => {
    if (localStorage.getItem(localStorageKey)) {
      setGraphData(JSON.parse(localStorage.getItem(localStorageKey) || '{"nodes": []}'));
    } else {
      setGraphData(source);
    }
  };

  useEffect(() => {
    if (graphData.nodes.length) {
      localStorage.setItem(localStorageKey, JSON.stringify(graphData));
    }
  }, [graphData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContext.Provider value={{ data: graphData, setData: setGraphData }}>
      <EditPageLayout title="Pos Layout">
        <Col>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row>
              <Card style={{ width: '100%' }} />
            </Row>
            <PosLayoutEditor data={graphData} onChange={setGraphData} />
          </Space>
        </Col>
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default PosEditorPage;
