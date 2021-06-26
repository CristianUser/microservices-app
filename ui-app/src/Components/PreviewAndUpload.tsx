/* eslint-disable react/require-default-props */
/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export type UploadOptions = {
  path?: string;
  filename?: string;
};

type Props = {
  onComplete?: (response: any) => void;
  imageUrl?: string;
  uploadOptions?: UploadOptions;
};

const PreviewAndUpload: FC<Props> = (props: Props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ file, fileList: _fileList }: any) => {
    setFileList(_fileList);
    if (file.response) {
      props.onComplete?.(file.response);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const { imageUrl, uploadOptions } = props;

  useEffect(() => {
    if (imageUrl) {
      const defaultFileList: any = [
        {
          uid: '-1',
          status: 'done',
          url: imageUrl
        }
      ];
      setFileList(defaultFileList);
    }
  }, [imageUrl]);

  return (
    <>
      <Upload
        action="http://localhost:50290/"
        data={uploadOptions}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        className="preview-uploader"
        style={{ width: '100%' }}
      >
        {fileList.length ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} alt={previewTitle} src={previewImage} />
      </Modal>
    </>
  );
};

export default PreviewAndUpload;
