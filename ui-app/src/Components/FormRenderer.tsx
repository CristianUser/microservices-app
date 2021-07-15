/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';

import PreviewAndUpload from './PreviewAndUpload';
import FormClient from '../Services/FormClient';
import PageContext from '../Contexts/PageContext';
import LayoutContext from '../Contexts/LayoutContext';
import EditPageLayout from '../Layouts/EditPage';
import JsonForm from './JsonForm';
import BasicClient from '../Services/BasicClient';
import { DataTextProp } from '../Utils/interfaces';
import { resolveDataText, resolvePath } from '../Utils/json-renderers';

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
