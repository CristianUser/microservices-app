import React, { FC } from 'react';
import { materialRenderers, materialCells } from '@cristianuser/antd-renderers';
import { JsonForms } from '@jsonforms/react';

type FormState<T> = {
  data: T;
  errors: any[];
};
type Props = {
  data: any;
  onChange: (state: FormState<any>) => void;
  uiSchema: any;
  schema: any;
};
const JsonForm: FC<Props> = (props: Props) => {
  const { data, onChange, uiSchema, schema } = props;

  return (
    <JsonForms
      schema={schema}
      uischema={uiSchema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={onChange}
    />
  );
};

export default JsonForm;
