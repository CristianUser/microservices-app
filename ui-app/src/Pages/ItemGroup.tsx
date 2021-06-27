/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Card,
  Checkbox,
  Col,
  Form,
  FormInstance,
  FormProps,
  Input,
  Row,
  Space,
  message
} from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import EditPageLayout from '../Layouts/EditPage';
import PreviewAndUpload from '../Components/PreviewAndUpload';
import CrudClient from '../Services/CrudClient';
import { ItemGroup } from '../Utils/interfaces';

const itemGroupClient = new CrudClient<ItemGroup>({ routePrefix: '/item/group' });
const PageContext = React.createContext({});

const SiderContent: FC = (): React.ReactElement => {
  const { data, setData }: any = useContext(PageContext);

  return (
    <>
      <PreviewAndUpload
        imageUrl={data.imageUrl}
        uploadOptions={{ path: '/item-group/' }}
        onComplete={(response, imageUrl) => {
          setData({ ...data, imageUrl });
        }}
      />
    </>
  );
};

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  style: { marginBottom: '4px' },
  wrapperCol: { offset: 1, span: 16 }
};

const BasicForm: FC<FormProps> = (props) => {
  const { data }: any = useContext(PageContext);

  return (
    <Form {...layout} name="basicForm" initialValues={data} {...props}>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Group Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...tailLayout} valuePropName="checked" name="disabled">
            <Checkbox>Disabled</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const ItemGroupPage: FC = () => {
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<ItemGroup>({});
  const [loading, setLoading] = useState(false);
  const [basicForm] = Form.useForm();
  const [descriptionForm] = Form.useForm();

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home'
    },
    {
      path: '/item-groups',
      breadcrumbName: 'Item Groups'
    },
    {
      path: `/item-group/${id}`,
      breadcrumbName: data?.name || 'Group'
    }
  ];

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      itemGroupClient
        .getDoc(id)
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, []);

  const onFinish = async (name: any, info: any) => {
    const formValues = data;

    await Promise.all(
      Object.keys(info.forms).map((key: string) => {
        const form: FormInstance = info.forms[key];

        return form.validateFields().then((values) => {
          _.merge(formValues, values);
        });
      })
    );

    try {
      const result = await itemGroupClient.save(id, formValues);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', result.id || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  return (
    <Form.Provider onFormFinish={onFinish}>
      <PageContext.Provider value={{ data, setData }}>
        <EditPageLayout
          left={<SiderContent />}
          breadcrumbRoutes={routes}
          onSave={() => basicForm.submit()}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card style={{ width: '100%' }} loading={loading}>
              <BasicForm form={basicForm} />
            </Card>
            <Card title="Description" style={{ width: '100%' }} loading={loading}>
              <Form form={descriptionForm} name="descriptionForm" initialValues={data}>
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
};

export default ItemGroupPage;
