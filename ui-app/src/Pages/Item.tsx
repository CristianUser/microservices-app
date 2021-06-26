import _ from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, FormInstance, FormProps, Image, Input, Row, Select, Space, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../Layouts/EditPage';
import itemClient from '../Services/Item';
import PreviewAndUpload from '../Components/PreviewAndUpload';

const PageContext = React.createContext({});

const SiderContent: FC = (): React.ReactElement => {
  const { data, setData }: any = useContext(PageContext);

  return (<>
    <PreviewAndUpload imageUrl={data.imageUrl} uploadOptions={{ path: '/item/' }} onComplete={({ uri }) => {
      setData({ ...data, imageUrl: `http://localhost:5000/files${uri}` })
    }} />
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

const BasicForm: FC<FormProps> = (props) => {
  const { data }: any = useContext(PageContext);

  return (
    <Form
      {...layout}
      name="basicForm"
      initialValues={data}
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
  const { id }: any = useParams();
  const history = useHistory()
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [basicForm] = Form.useForm();
  const [descriptionForm] = Form.useForm();


  useEffect(() => {
    if (id !== 'new') {
      setLoading(true)
      itemClient.getItem(id).then(setData).finally(() => setLoading(false))
    }
  }, [])

  const onFinish = async (name: any, info: any) => {
    const formValues = data;

    await Promise.all(Object.keys(info.forms).map((key: string) => {
      const form: FormInstance = info.forms[key];

      return form.validateFields().then(values => {
        _.merge(formValues, values)
      })
    }))

    try {
      const result = await itemClient.save(id, formValues);

      message.success('Item Saved!')
      history.replace(history.location.pathname.replace('new', result.id))
    } catch (error) {
      message.error('Error saving!')
    }

  };

  return (
    <Form.Provider onFormFinish={onFinish}>
      <PageContext.Provider value={{ data, setData }}>
        <EditPageLayout left={<SiderContent />} breadcrumbRoutes={routes} onSave={() => basicForm.submit()}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card style={{ width: '100%' }} loading={loading}>
              <BasicForm form={basicForm} />
            </Card>
            <Card title="Description" style={{ width: '100%' }} loading={loading}>
              <Form form={descriptionForm} name="descriptionForm" initialValues={data}>
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
      </PageContext.Provider>
    </Form.Provider>
  );
}

export default ItemPage;
