/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import '@antv/graphin-icons/dist/index.css';

import React, { FC, useContext, useEffect } from 'react';
import Graphin, {
  Behaviors,
  GraphinContext,
  GraphinContextType,
  GraphinData,
  IG6GraphEvent,
  NodeConfig
} from '@antv/graphin';

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

type PosLayoutProps = {
  data: GraphinData;
  onClickNode?: (node: NodeConfig) => void;
};

const PosLayout: FC<PosLayoutProps> = (props: PosLayoutProps) => {
  const { onClickNode, data } = props;

  const NodeClicks = createEventHandler('node:click', (evt) => {
    const node = evt.item as any;
    const model = node?.getModel() as NodeConfig;
    onClickNode?.(model);
  });

  return (
    <Graphin
      data={data}
      layout={{
        type: 'graphin-force'
      }}
    >
      <FontPaint />
      <NodeClicks />
      <ZoomCanvas sensitivity={100} enableOptimize />
    </Graphin>
  );
};
export default PosLayout;
