import React, { FC } from 'react';
import { Tag } from 'antd';

type StatusTagProps = {
  status: string;
};

const StatusTag: FC<StatusTagProps> = (props: StatusTagProps) => {
  const { status } = props;
  const STATUS_TEXT: any = {
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived'
  };
  const STATUS_COLOR: any = {
    active: '#87d068',
    draft: '#f50',
    archived: 'red'
  };
  const color = STATUS_COLOR[status];
  const text = STATUS_TEXT[status];

  return status ? <Tag color={color}>{text}</Tag> : null;
};

export default StatusTag;
