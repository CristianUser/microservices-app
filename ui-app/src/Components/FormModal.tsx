/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { useHistory } from 'react-router-dom';

import JsonForm from './JsonForm';
import FormClient from '../Services/FormClient';
import BasicClient from '../Services/BasicClient';
import { resolvePath } from '../Utils/json-renderers';

const formClient = new FormClient();

interface FormModalProps {
  apiRoutePrefix: string;
  data?: any;
  schemaPrefix?: string;
  skipSave?: boolean;
  title: string;
  visible: boolean;
  toNewDoc?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
  apiRoutePrefix,
  data: initialData,
  visible,
  onSave: onSaveModal,
  onCancel,
  schemaPrefix = '',
  skipSave = false,
  title,
  toNewDoc
}: FormModalProps) => {
  const client = new BasicClient<any>({ routePrefix: apiRoutePrefix });
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [errors, setErrors] = useState<any>([]);
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const localStorageKey = `${apiRoutePrefix}/schema.json.formData`;

  // const fetchSchema = (params = {}) => {
  //   setLoading(true);
  //   formClient
  //     .getSchema(`${apiRoutePrefix}/schema.json`, params)
  //     .then(setSchema)
  //     .finally(() => setLoading(false));
  // };

  const onSave = async () => {
    if (errors?.length) {
      message.error('There are some errors to pay attention');
      return;
    }
    if (skipSave) {
      onSaveModal?.(data);
    } else {
      setLoading(true);
      try {
        const doc = await client.save('new', data);

        message.success('Saved successfully!');
        localStorage.removeItem(localStorageKey);
        history.push(resolvePath(toNewDoc.to, doc));
        onSaveModal?.(doc);
      } catch (error) {
        message.error('Error saving!');
      }
      setLoading(false);
    }
  };
  const onDiscard = () => {
    localStorage.removeItem(localStorageKey);
    onCancel?.();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema(`${apiRoutePrefix}/${schemaPrefix}schema.json`).then(setSchema);
      await formClient
        .getSchema(`${apiRoutePrefix}/${schemaPrefix}uischema.json`)
        .then(setUiSchema);

      setData(JSON.parse(localStorage.getItem(localStorageKey) || '{}'));
    } catch (error) {
      message.error('Error loading schemas');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onDiscard}
      onOk={onSave}
      confirmLoading={loading}
    >
      <JsonForm
        loading={loading}
        uiSchema={uiSchema}
        schema={schema}
        data={data}
        onChange={(form) => {
          setData(form.data);
          setErrors(form.errors);
        }}
      />
    </Modal>
  );
};

export default FormModal;
