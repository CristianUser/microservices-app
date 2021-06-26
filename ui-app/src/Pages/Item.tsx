import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, FormInstance, FormProps, Image, Input, Row, Select, Space } from 'antd';
import { useParams } from 'react-router-dom';
import EditPageLayout from '../Layouts/EditPage';
import itemClient from '../Services/Item';
import _ from 'lodash';


const SiderContent: FC = (): React.ReactElement => {
  return (<>
    <Image
      width={200}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </>)
};

const routes = [
  {
    path: '/',
    breadcrumbName: 'Home',
  },
  {
    path: '/items-list',
    breadcrumbName: 'Items',
  },
  {
    path: '/item/id',
    breadcrumbName: 'Item Name',
  },
];

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  style: { marginBottom: '4px' },
  wrapperCol: { offset: 1, span: 16 },
};

const FormContext = React.createContext({});
const BasicForm: FC<FormProps> = (props) => {
  const formValue = useContext(FormContext);

  return (
    <Form
      {...layout}
      name="basicForm"
      initialValues={formValue}
      {...props}
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
          <Form.Item {...tailLayout} valuePropName="checked" name="disabled">
            <Checkbox>Disabled</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout} valuePropName="checked" name="allowAlternativeItem">
            <Checkbox>Allow Alternative Item</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout} valuePropName="checked" name="maintainStock">
            <Checkbox>Maintain Stock</Checkbox>
          </Form.Item>
          <Form.Item
            label="Something"
            name="something"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

const ItemPage: FC = () => {
  let { id }: any = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [basicForm] = Form.useForm();
  const [descriptionForm] = Form.useForm();


  useEffect(() => {
    setLoading(true)
    itemClient.getItem(id).then(setData).then(() => setLoading(false))
  }, [])

  const onFinish = async (name: any, info: any) => {
    const formValues = data;

    await Promise.all(Object.keys(info.forms).map((key: string) => {
      const form: FormInstance = info.forms[key];

      return form.validateFields().then(values => {
        _.merge(formValues, values)
      })
    }))

    itemClient.save(id, formValues).then(data => {
      console.log('returned data', data);
    })
  };

  return (
    <Form.Provider onFormFinish={onFinish}>
      <FormContext.Provider value={data}>
        <EditPageLayout left={<SiderContent />} breadcrumbRoutes={routes} onSave={() => basicForm.submit()}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card style={{ width: '100%' }} loading={loading}>
              <BasicForm form={basicForm} />
            </Card>
            <Card title="Description" style={{ width: '100%' }} loading={loading}>
              <Form  form={descriptionForm} name="descriptionForm" initialValues={data}>
                <Form.Item name="brand" label="Brand">
                  <Select style={{ width: 120 }}>
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
      </FormContext.Provider>
    </Form.Provider>
  );
}

export default ItemPage;
