import React, { FC } from 'react';
import { Button, Card, Checkbox, Col, Form, Image, Input, Row, Select, Space } from 'antd';
import EditPageLayout from '../Layouts/EditPage';

const SiderContent: FC = (): React.ReactElement => {
  return (<>
    <Image
      width={200}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </>)
};


const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  style: { marginBottom: '4px' },
  wrapperCol: { offset: 1, span: 16 },
};

const BasicForm: FC = () => {
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ maintainStock: true }}
    >
      <Row>
        <Col span={12}>
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Item Group"
            name="itemGroup"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Unit of Measure"
            name="uom"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...tailLayout} name="disabled">
            <Checkbox>Disabled</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout} name="allowAlternativeItem">
            <Checkbox>Allow Alternative Item</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout} name="maintainStock">
            <Checkbox>Maintain Stock</Checkbox>
          </Form.Item>
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
const ItemPage: FC = () => {

  return (
    <EditPageLayout left={<SiderContent />}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card style={{ width: '100%' }}>
          <BasicForm />
        </Card>
        <Card title="Description" style={{ width: '100%' }}>
          <Form>
            <Form.Item name="brand" label="Brand">
              <Select defaultValue="lucy" style={{ width: 120 }}>
                <Select.Option value="jack">Jack</Select.Option>
                <Select.Option value="lucy">Lucy</Select.Option>
                <Select.Option value="disabled" disabled>
                  Disabled
                </Select.Option>
                <Select.Option value="Yiminghe">yiminghe</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </EditPageLayout>
  );
}

export default ItemPage;
