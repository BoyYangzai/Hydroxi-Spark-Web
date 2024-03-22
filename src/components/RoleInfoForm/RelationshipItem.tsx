import { ProForm, ProFormTextArea } from "@ant-design/pro-components"
import { useEffect, useState } from "react";
import { message, type GetProp, type UploadProps,UploadFile, Upload, Modal } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import styles from './RelationshipItem.module.less'


// don't delete this line
console.log(styles, 'styles');

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const RelationshipItem = ({
  relationLevel,
  roleShowInfo,
  setRoleShowsInfos
}: {
    relationLevel: number,
    roleShowInfo: {
      roleShows: UploadFile[]
    },
    setRoleShowsInfos:(fileList:string[]) => void
  }) => {
const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState< UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange =async ({  fileList }: {
    fileList: UploadFile[]
  }) =>
  {
    let updatedFile = fileList;
    updatedFile = await Promise.all(fileList.map(async (file) => {
    if (!file.url) {
        file.url = await getBase64(file.originFileObj as FileType);
    }
    return file;
    }));
    setFileList(updatedFile)
    setRoleShowsInfos(updatedFile.map((item) => item.url!)??[])
  }
  
  useEffect(() => {
    //@ts-ignore
    setFileList(roleShowInfo?.roleShows?.map((item) => {
      return {
        uid: item,
        name: item,
        status: 'done',
        thumbUrl: item,
        url: item,
        }
      }
    ) )
  }, [roleShowInfo])
  const uploadButton = (
    <button style={{
      width: '100%',
      height: '100%',
      background: 'none',
      border: 0
    }}
      type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return <div style={{
    marginBottom: '50px'
  }}>
     <ProFormTextArea
      name={`intimacyInfoLevel${relationLevel}`}
      label={`${relationLevel}级亲密度`}
      required />
    
    <ProForm.Item label={`${relationLevel}级图片（锁定，上传尺寸：\n 892*1184）`}
      labelCol={{ span: 30 }}
      style={{
        height: '200px',
      }}
      required
    >
      <Upload
        listType="picture-card"
        onPreview={handlePreview}
        onChange={(info) => {
          handleChange({ fileList: info.fileList});
        }}
        fileList={fileList}
        maxCount={4-roleShowInfo?.roleShows?.length}
        beforeUpload={(file) => {
          const isPicture = file.type.startsWith('image/');
           if (!isPicture) {
             message.error(`${file.name} is not a Picture file`);
           }
            return isPicture || Upload.LIST_IGNORE;
        }}
      >
        {fileList?.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </ProForm.Item>
  </div>
}

export default RelationshipItem
