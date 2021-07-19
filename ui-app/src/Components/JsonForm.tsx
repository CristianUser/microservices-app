/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react';
import { renderers, cells } from '@cristianuser/antd-renderers';
import { JsonForms } from '@jsonforms/react';
import { Card, Space } from 'antd';

type FormState<T> = {
  data: T;
  errors: any[];
};
type JsonFormProps = {
  data: any;
  onChange: (state: FormState<any>) => void;
  uiSchema: any;
  schema: any;
  loading: boolean;
};
const JsonForm: FC<JsonFormProps> = (props: JsonFormProps) => {
  const { data, onChange, uiSchema, schema, loading = false } = props;

  return loading ? (
    <Space direction="vertical" style={{ width: '100%' }}>
      {uiSchema?.elements?.map?.((element: any, i: number) => (
        <Card style={{ width: '100%' }} key={`card_${i}`} loading />
      ))}
    </Space>
  ) : (
    <JsonForms
      schema={schema}
      uischema={uiSchema}
      data={data}
      renderers={renderers}
      cells={cells}
      onChange={onChange}
    />
  );
};

export default JsonForm;
