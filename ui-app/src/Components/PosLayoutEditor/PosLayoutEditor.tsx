/* eslint-disable @typescript-eslint/no-shadow */
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
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import IconLoader from '@antv/graphin-icons';
import { Item } from '@antv/graphin-components/lib/ContextMenu/Menu';
import { Button, Card, Col, Row } from 'antd';
import _ from 'lodash';

import FormModal from './FormModal';

const icons = Graphin.registerFontFamily(IconLoader);
const { Menu } = ContextMenu;
const { FontPaint, ZoomCanvas } = Behaviors;

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
  const [showForm, setShowForm] = useState(false);
  const [editingNode, setEditingNode] = useState<any>({});
  const onAddTable = () => {
    const newNode: IUserNode = {
      id: `node-${Date.now()}`,
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
        badges: [{ position: 'RT', type: 'text', value: 3 }],
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
  const handleContextMenu = (item: Item, evtData: any) => {
    const { key } = item;

    switch (key) {
      case 'remove-node':
        setData({
          ...data,
          nodes: _.remove(data.nodes, (node: any) => node.id !== evtData.id)
        });
        break;
      case 'edit-node':
        setEditingNode(evtData);
        setShowForm(true);
        break;
      default:
        break;
    }
  };

  const onSaveNode = (editedNode: IUserNode) => {
    const newList = [...data.nodes];
    const idx = newList.findIndex((node) => node.id === editedNode.id);

    newList[idx] = editedNode;

    setData({
      ...data,
      nodes: newList
    });
    setShowForm(false);
  };

  const NodeClicks = createEventHandler('node:click', (evt) => {
    const node = evt.item as any;
    const model = node?.getModel() as NodeConfig;
    onClickNode?.(model);
  });

  const GraphChanges = createEventHandler('dragnodeend', (evt, { graph }) => {
    const graphData = graph.save() as GraphinData;

    setData(graphData);
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    onChange?.(data);
  }, [data]);

  return (
    <Row gutter={20}>
      <FormModal
        visible={showForm}
        data={editingNode}
        onCancel={() => setShowForm(false)}
        onSave={onSaveNode}
      />
      <Col span={4}>
        <Card>
          <Button onClick={onAddTable}>Add Table</Button>
        </Card>
      </Col>
      <Col span={20}>
        <Graphin
          data={data}
          layout={{
            type: 'graphin'
          }}
        >
          <FontPaint />
          <NodeClicks />
          <GraphChanges />
          <ZoomCanvas sensitivity={100} enableOptimize />
          <ContextMenu bindType="node" style={{ width: '140px' }}>
            <Menu
              bindType="node"
              options={[
                {
                  icon: <EditOutlined />,
                  key: 'edit-node',
                  name: 'Edit Node'
                },
                {
                  icon: <DeleteOutlined />,
                  key: 'remove-node',
                  name: 'Remove Node'
                }
              ]}
              onChange={handleContextMenu}
            />
          </ContextMenu>
        </Graphin>
      </Col>
    </Row>
  );
};
export default PosLayoutEditor;
