/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';

import PreviewAndUpload from './PreviewAndUpload';
import FormClient from '../Services/FormClient';
import PageContext from '../Contexts/PageContext';
import EditPageLayout from '../Layouts/EditPage';
import JsonForm from './JsonForm';
import BasicClient from '../Services/BasicClient';
import { DataTextProp } from '../Utils/interfaces';
import { resolveDataText, resolvePath } from '../Utils/json-renderers';
import StatusTag from './StatusTag';

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
  const { id }: any = useParams();
  const history = useHistory();
  const [data, setData] = useState<any>({});
  const [errors, setErrors] = useState<any>([]);
  const [initialData, setInitialData] = useState<any>({});
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const isNewDoc = useMemo(() => id === 'new', [id]);
  const localStorageKey = `${schemaPath}.formData`;
  const resolvedTitle = resolveDataText(title, data);
  const resolvedBreadcrumbRoutes = breadcrumbRoutes.map((route) => {
    return {
      path: resolvePath(route.path, data),
      breadcrumbName: resolveDataText(route.breadcrumbName, data)
    };
  });

  useEffect(() => {
    if (isNewDoc && Object.keys(data).length) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await formClient.getSchema(schemaPath).then(setSchema);
      if (!isNewDoc) {
        await client.getDoc(id).then((response) => {
          setData(response);
          setInitialData(response);
        });
      } else {
        setData(JSON.parse(localStorage.getItem(localStorageKey) || '{}'));
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
    if (errors?.length) {
      message.error('There are some errors to pay attention');
      return;
    }

    try {
      const { status, createdAt, updatedAt, id: newId } = await client.save(id, data);

      setInitialData({ ...data, status, createdAt, updatedAt });
      message.success('Saved successfully!');
      localStorage.removeItem(localStorageKey);
      history.replace(history.location.pathname.replace('new', newId || ''));
    } catch (error) {
      message.error('Error saving!');
    }
  };
  const onDiscard = () => {
    localStorage.removeItem(localStorageKey);
  };

  return (
    <PageContext.Provider
      value={{ data, setData, initialData, setInitialData, includeImage, apiRoutePrefix }}
    >
      <EditPageLayout
        left={<SiderContent />}
        breadcrumbRoutes={resolvedBreadcrumbRoutes}
        title={resolvedTitle}
        tags={<StatusTag status={data.status} />}
        onSave={onSave}
        onDiscard={onDiscard}
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
      </EditPageLayout>
    </PageContext.Provider>
  );
};

export default FormPageRenderer;
