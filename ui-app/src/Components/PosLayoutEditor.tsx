/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import '@antv/graphin-icons/dist/index.css';

import React, { FC, useContext, useEffect, useState } from 'react';
import Graphin, {
  Behaviors,
  GraphinContext,
  GraphinContextType,
  GraphinData,
  IG6GraphEvent,
  IUserNode,
  NodeConfig
} from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import { PlusOutlined } from '@ant-design/icons';
import IconLoader from '@antv/graphin-icons';
import { Item } from '@antv/graphin-components/lib/ContextMenu/Menu';
import { Button, Card, Col, Row } from 'antd';

const icons = Graphin.registerFontFamily(IconLoader);
const { Menu } = ContextMenu;
const { FontPaint } = Behaviors;

function createEventHandler(
  event: string,
  handleEvent: (evt: IG6GraphEvent, context: GraphinContextType) => void
) {
  return () => {
    const context = useContext(GraphinContext);
    const handler = (evt: IG6GraphEvent) => handleEvent(evt, context);
    useEffect(() => {
      context.graph.on(event, handler);
      return () => {
        context.graph.off(event, handler);
      };
    }, []);
    return null;
  };
}

type PosLayoutEditorProps = {
  data?: any;
  onClickNode?: (node: NodeConfig) => void;
  onChange?: (data: GraphinData) => void;
};

const PosLayoutEditor: FC<PosLayoutEditorProps> = (props: PosLayoutEditorProps) => {
  const { onClickNode, onChange, data: initialData } = props;
  const [data, setData] = useState<GraphinData>(initialData);
  const onAddTable = () => {
    const newNode: IUserNode = {
      id: `node-${data.nodes.length}`,
      style: {
        keyshape: {
          size: 80
        },
        icon: {
          size: 30,
          fontFamily: 'graphin',
          type: 'font',
          value: icons.user
        },
        badges: [{ type: 'text', value: 3 }],
        label: {
          value: `Table ${data.nodes.length}`
        }
      }
    };

    setData({
      ...data,
      nodes: [...data.nodes, newNode]
    });
  };
  const handleAddNode = (item: Item) => {
    const { key } = item;
    if (key === 'add-node') {
      console.log('from context menu');
    }
  };

  const NodeClicks = createEventHandler('node:click', (evt) => {
    const node = evt.item as any;
    const model = node?.getModel() as NodeConfig;
    onClickNode?.(model);
  });

  const GraphChanges = createEventHandler('dragnodeend', (evt, { graph }) => {
    const graphData = graph.save() as GraphinData;

    onChange?.(graphData);
    setData(graphData);
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <Row gutter={20}>
      <Col span={4}>
        <Card>
          <Button onClick={onAddTable}>Add Table</Button>
        </Card>
      </Col>
      <Col span={20}>
        <Graphin
          data={data}
          layout={{
            type: 'graphin-force'
          }}
        >
          <FontPaint />
          <NodeClicks />
          <GraphChanges />
          {/* <ZoomCanvas sensitivity={100} enableOptimize /> */}
          <ContextMenu bindType="canvas" style={{ width: '140px' }}>
            <Menu
              bindType="canvas"
              options={[
                {
                  icon: <PlusOutlined />,
                  key: 'add-node',
                  name: 'Add Node'
                }
              ]}
              onChange={handleAddNode}
            />
          </ContextMenu>
        </Graphin>
      </Col>
    </Row>
  );
};
export default PosLayoutEditor;
