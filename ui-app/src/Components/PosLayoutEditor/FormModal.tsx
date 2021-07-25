/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import _ from 'lodash';

interface CollectionCreateFormProps {
  data: any;
  visible: boolean;
  onSave: (node: any) => void;
  onCancel?: () => void;
}

const FormModal: React.FC<CollectionCreateFormProps> = ({
  data,
  visible,
  onSave,
  onCancel
}: CollectionCreateFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title: _.get(data, 'style.label.value') });
  }, [data]);

  return (
    <Modal
      visible={visible}
      title="Edit Table"
      onCancel={() => onCancel?.()}
      onOk={() => {
        form.validateFields().then((values) => {
          _.set(data, 'style.label.value', values.title);
          onSave(data);
        });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of node!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="type">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
