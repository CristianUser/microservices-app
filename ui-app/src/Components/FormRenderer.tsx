/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import _ from 'lodash';

import PreviewAndUpload from './PreviewAndUpload';
import FormClient from '../Services/FormClient';
import PageContext from '../Contexts/PageContext';
import LayoutContext from '../Contexts/LayoutContext';
import EditPageLayout from '../Layouts/EditPage';
import JsonForm from './JsonForm';
import BasicClient from '../Services/BasicClient';

const formClient = new FormClient();

const SiderContent: FC = (): React.ReactElement => {
  const { data, setData, includeImage, apiRoutePrefix } = useContext(PageContext);

  return (
    <>
      {includeImage && (
        <PreviewAndUpload
          imageUrl={data?.imageUrl}
          uploadOptions={{ path: apiRoutePrefix }}
          onComplete={({ uri }) => {
            setData?.({ ...data, imageUrl: `http://localhost:5000/files${uri}` });
          }}
        />
      )}
    </>
  );
};

type DataTextProp = {
  dynamic?: boolean;
  value: string;
};

type BreadcrumbRoute = {
  path: string;
  breadcrumbName: DataTextProp;
};

type FormPageRendererProps = {
  apiRoutePrefix: string;
  schemaPath: string;
  uiSchema: any;
  title: DataTextProp;
  includeImage: boolean;
  breadcrumbRoutes: BreadcrumbRoute[];
};

function resolveDataText(text: DataTextProp, data: any) {
  return text.dynamic ? _.get(data, text.value, text.value) : text.value || text;
}

function resolvePath(path: string, data: any) {
  const TOKEN_REGEX = /\{[a-zA-Z0-9_.\-/]+\}/;
  const value = path.match(TOKEN_REGEX)?.[0].replace('{', '').replace('}', '');

  return value ? path.replace(TOKEN_REGEX, _.get(data, value, path)) : path;
}

const FormPageRenderer: FC<FormPageRendererProps> = (props: FormPageRendererProps) => {
  const { apiRoutePrefix, uiSchema, schemaPath, title, includeImage, breadcrumbRoutes } = props;

  const client = new BasicClient<any>({ routePrefix: apiRoutePrefix });
  const { setInitialData } = useContext(LayoutContext);
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const resolvedTitle = resolveDataText(title, data);
  const resolvedBreadcrumbRoutes = breadcrumbRoutes.map((route) => {
    return {
      path: resolvePath(route.path, data),
      breadcrumbName: resolveDataText(route.breadcrumbName, data)
    };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema(schemaPath).then(setSchema);
      if (id !== 'new') {
        await client.getDoc(id).then((response) => {
          setData(response);
          setInitialData?.(response);
        });
      }
    } catch (error) {
      message.error('Error loading data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSave = async () => {
    try {
      const result = await client.save(id, data);

      message.success('Saved successfully!');
      history.replace(history.location.pathname.replace('new', result.id || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };

  return (
    <PageContext.Provider value={{ data, setData, includeImage, apiRoutePrefix }}>
      <EditPageLayout
        left={<SiderContent />}
        breadcrumbRoutes={resolvedBreadcrumbRoutes}
        title={resolvedTitle}
        subTitle={data?.status}
        onSave={onSave}
      >
        {loading ? (
          <Card style={{ width: '100%' }} loading={loading} />
        ) : (
          <JsonForm
            uiSchema={uiSchema}
            schema={schema}
            data={data}
            onChange={(form) => {
              setData(form.data);
            }}
          />
        )}
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default FormPageRenderer;
