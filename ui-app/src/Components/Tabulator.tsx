/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
import { Tabs } from 'antd';
import React, { FC, useEffect, useState } from 'react';

const { TabPane } = Tabs;

export type Pane = {
  title: string;
  key: string;
  closable?: boolean;
  content?: any;
  data?: any;
};

const initialPanes: Pane[] = [
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1', closable: false },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' }
];

type TabulatorProps = {
  tab?: TabRef;
  onChange?: (panes: Pane[]) => void;
  data?: Pane[];
  content?: FC<any>;
};

type TabRef = {
  addPane: (pane?: Pane) => void;
  removePane: (key: string) => void;
  select: (key: string) => void;
  getPane: (key: string) => Pane | undefined;
};

export function useTab(): TabRef {
  return { addPane: () => {}, removePane: () => {}, select: () => {}, getPane: () => ({} as any) };
}

const contentWithProps = (Component: FC<any> | undefined, data: Pane) => {
  if (Component) {
    return <Component {...data} />;
  }
  return <></>;
};

const Tabulator: FC<TabulatorProps> = (props: TabulatorProps) => {
  const { tab, data, onChange, content } = props;
  let newTabIndex = 0;
  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  const [panes, setPanes] = useState(data || initialPanes);

  const onChangeTabs = (key: string) => {
    setActiveKey(key);
  };

  const getPane = (targetKey: string): Pane | undefined =>
    panes.find((pane) => pane.key === targetKey);

  const add = (paneData: Pane & any = { title: 'New Tab' }) => {
    const { title, key } = paneData;
    const newActiveKey = key || `newTab${(newTabIndex += 1)}`;
    const newPanes = [...panes];
    newPanes.push({ title, key: newActiveKey, data: paneData.data || {} });
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (typeof lastIndex === 'number' && lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }

    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: any, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    }

    if (action === 'remove') {
      remove(targetKey);
    }
  };

  useEffect(() => {
    onChange?.(panes);
  }, [onChange, panes]);

  useEffect(() => {
    setPanes(data || panes);
  }, [data]);

  useEffect(() => {
    if (tab) {
      tab.addPane = add;
      tab.removePane = remove;
      tab.getPane = getPane;
      tab.select = (key) => setActiveKey(key);
    }
  }, [tab]);

  return (
    <Tabs type="editable-card" onChange={onChangeTabs} activeKey={activeKey} onEdit={onEdit}>
      {panes.map((pane) => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {contentWithProps(content, { ...pane.data, id: pane.key })}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Tabulator;
